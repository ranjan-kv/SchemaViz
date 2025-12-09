import simpleGit from 'simple-git';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';    
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Clones a GitHub repository to a temporary directory
 * @param {string} repoUrl - GitHub repository URL
 * @returns {Promise<string>} - Path to the cloned repository
 */
export async function cloneRepository(repoUrl) {
    try {
        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '../../temp');
        await fs.mkdir(tempDir, { recursive: true });

        // Generate unique folder name
        const repoName = repoUrl.split('/').pop().replace('.git', '');
        const timestamp = Date.now();
        const clonePath = path.join(tempDir, `${repoName}-${timestamp}`);

        // Clone the repository
        const git = simpleGit();
        await git.clone(repoUrl, clonePath, ['--depth', '1']); // Shallow clone for speed

        return clonePath;
    } catch (error) {
        throw new Error(`Failed to clone repository: ${error.message}`);
    }
}

/**
 * Cleanup: Delete cloned repository
 * @param {string} repoPath - Path to the cloned repository
 */
export async function cleanupRepository(repoPath) {
    try {
        await fs.rm(repoPath, { recursive: true, force: true });
        console.log(`🧹 Cleaned up: ${repoPath}`);
    } catch (error) {
        console.error(`Failed to cleanup ${repoPath}:`, error.message);
    }
}
