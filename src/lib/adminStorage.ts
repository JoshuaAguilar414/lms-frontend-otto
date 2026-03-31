import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import AdmZip from 'adm-zip';

export interface UploadedCourse {
  _id: string;
  title: string;
  tag?: string;
  description?: string;
  thumbnail?: string;
  scormUrl?: string;
  admissionId?: string;
  totalLessons?: number;
  isActive: boolean;
}

interface AdminData {
  courses: UploadedCourse[];
  logoUrl: string | null;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'admin.json');
const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const SCORM_UPLOADS_DIR = path.join(PUBLIC_UPLOADS_DIR, 'scorm');
const LOGO_UPLOADS_DIR = path.join(PUBLIC_UPLOADS_DIR, 'logo');
const COURSE_IMAGE_UPLOADS_DIR = path.join(PUBLIC_UPLOADS_DIR, 'course-images');

const DEFAULT_DATA: AdminData = {
  courses: [],
  logoUrl: null,
};

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');
}

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractLaunchPathFromManifest(manifestContent: string): string | null {
  const resourceMatch = manifestContent.match(/<resource[^>]*\bhref="([^"]+)"[^>]*>/i);
  if (resourceMatch?.[1]) return decodeXmlEntities(resourceMatch[1]).replace(/\\/g, '/');
  return null;
}

async function ensureDirectories() {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(PUBLIC_UPLOADS_DIR, { recursive: true });
  await mkdir(SCORM_UPLOADS_DIR, { recursive: true });
  await mkdir(LOGO_UPLOADS_DIR, { recursive: true });
  await mkdir(COURSE_IMAGE_UPLOADS_DIR, { recursive: true });
}

async function readAdminData(): Promise<AdminData> {
  await ensureDirectories();
  try {
    const raw = await readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<AdminData>;
    return {
      courses: Array.isArray(parsed.courses) ? parsed.courses : [],
      logoUrl: typeof parsed.logoUrl === 'string' ? parsed.logoUrl : null,
    };
  } catch {
    return DEFAULT_DATA;
  }
}

async function writeAdminData(data: AdminData): Promise<void> {
  await ensureDirectories();
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export async function saveScormUpload(input: {
  productId: string;
  title: string;
  tag: string;
  description: string;
  imageFileName: string;
  imageFileBuffer: Buffer;
  fileName: string;
  fileBuffer: Buffer;
}): Promise<UploadedCourse> {
  await ensureDirectories();
  const safeName = sanitizeFilename(input.fileName || 'package.zip');
  const safeImageName = sanitizeFilename(input.imageFileName || 'course-image.png');
  const timestamp = Date.now();
  const safeProductId = sanitizeFilename(input.productId);
  const extractionFolderName = `${safeProductId}-${timestamp}`;
  const extractionDir = path.join(SCORM_UPLOADS_DIR, extractionFolderName);
  const zipBackupPath = path.join(extractionDir, `source-${safeName}`);
  const imageStoredName = `${safeProductId}-${timestamp}-${safeImageName}`;
  const imageDiskPath = path.join(COURSE_IMAGE_UPLOADS_DIR, imageStoredName);
  const imagePublicUrl = `/uploads/course-images/${imageStoredName}`;

  // Replace previous extracted package for this product.
  const currentData = await readAdminData();
  const previous = currentData.courses.find((c) => c._id === input.productId);
  if (previous?.scormUrl?.startsWith('/uploads/scorm/')) {
    const relativePath = previous.scormUrl.replace('/uploads/scorm/', '');
    const previousRoot = relativePath.split('/')[0];
    if (previousRoot) {
      try {
        // Best effort cleanup only; on Windows old files can be locked by dev server/browser.
        await rm(path.join(SCORM_UPLOADS_DIR, previousRoot), {
          recursive: true,
          force: true,
        });
      } catch {
        // Ignore cleanup failures and continue with the new upload.
      }
    }
  }

  await mkdir(extractionDir, { recursive: true });
  await writeFile(zipBackupPath, input.fileBuffer);
  await writeFile(imageDiskPath, input.imageFileBuffer);

  let zip: AdmZip;
  try {
    zip = new AdmZip(input.fileBuffer);
  } catch {
    throw new Error('Invalid ZIP file. Please upload a valid SCORM ZIP package.');
  }
  const entries = zip.getEntries();
  if (!entries.length) throw new Error('SCORM ZIP is empty.');

  let indexPathInsideZip: string | null = null;
  let manifestLaunchPath: string | null = null;
  const extractedFiles = new Set<string>();
  for (const entry of entries) {
    const rawName = entry.entryName.replace(/\\/g, '/');
    if (!rawName || rawName.endsWith('/')) continue;
    const normalized = path.posix.normalize(rawName).replace(/^(\.\.(\/|\\|$))+/, '');
    if (!normalized || normalized.startsWith('..')) continue;
    extractedFiles.add(normalized.toLowerCase());
    if (path.posix.basename(normalized).toLowerCase() === 'index.html') {
      if (!indexPathInsideZip || normalized.length < indexPathInsideZip.length) {
        indexPathInsideZip = normalized;
      }
    }
    if (path.posix.basename(normalized).toLowerCase() === 'imsmanifest.xml') {
      const manifestContent = entry.getData().toString('utf8');
      const launchPath = extractLaunchPathFromManifest(manifestContent);
      if (launchPath) {
        const launchDir = path.posix.dirname(normalized);
        manifestLaunchPath = path.posix.normalize(
          launchDir === '.' ? launchPath : `${launchDir}/${launchPath}`
        );
      }
    }
    const outputPath = path.join(extractionDir, normalized);
    const outputDir = path.dirname(outputPath);
    await mkdir(outputDir, { recursive: true });
    await writeFile(outputPath, entry.getData());
  }

  const fallbackHtmlCandidates = [
    'story.html',
    'story_html5.html',
    'launch.html',
    'player.html',
    'start.html',
  ];

  let launchPath = indexPathInsideZip;
  if (!launchPath && manifestLaunchPath && extractedFiles.has(manifestLaunchPath.toLowerCase())) {
    launchPath = manifestLaunchPath;
  }
  if (!launchPath) {
    const fallback = Array.from(extractedFiles).find((file) =>
      fallbackHtmlCandidates.some((candidate) => file.endsWith(`/${candidate}`) || file === candidate)
    );
    if (fallback) launchPath = fallback;
  }

  if (!launchPath) {
    throw new Error('SCORM package must contain a launch HTML file (index.html or manifest href target).');
  }

  const publicUrl = `/uploads/scorm/${extractionFolderName}/${launchPath}`;

  const data = await readAdminData();
  const existingIndex = data.courses.findIndex((c) => c._id === input.productId);
  const nextCourse: UploadedCourse = {
    _id: input.productId,
    title: input.title,
    tag: input.tag,
    description: input.description,
    thumbnail: imagePublicUrl,
    scormUrl: publicUrl,
    admissionId: data.courses[existingIndex]?.admissionId || '',
    totalLessons: data.courses[existingIndex]?.totalLessons || 1,
    isActive: true,
  };

  if (existingIndex >= 0) data.courses[existingIndex] = nextCourse;
  else data.courses.unshift(nextCourse);

  await writeAdminData(data);
  return nextCourse;
}

export async function saveLogoUpload(input: {
  fileName: string;
  fileBuffer: Buffer;
}): Promise<string> {
  await ensureDirectories();
  const safeName = sanitizeFilename(input.fileName || 'logo.png');
  const timestamp = Date.now();
  const storedName = `${timestamp}-${safeName}`;
  const diskPath = path.join(LOGO_UPLOADS_DIR, storedName);
  const publicUrl = `/uploads/logo/${storedName}`;

  await writeFile(diskPath, input.fileBuffer);

  const data = await readAdminData();
  data.logoUrl = publicUrl;
  await writeAdminData(data);
  return publicUrl;
}

export async function getUploadedCourses(): Promise<UploadedCourse[]> {
  const data = await readAdminData();
  return data.courses.filter((c) => c.isActive !== false);
}

export async function getUploadedCourseById(id: string): Promise<UploadedCourse | null> {
  const all = await getUploadedCourses();
  return all.find((c) => c._id === id) ?? null;
}

export async function getCurrentLogoUrl(): Promise<string | null> {
  const data = await readAdminData();
  return data.logoUrl;
}
