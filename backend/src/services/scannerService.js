import fs from 'fs/promises';
import path from 'path';

/**
 * Scans a repository for database schema files
 * @param {string} repoPath - Path to the cloned repository
 * @returns {Promise<Object>} - Object containing detected files and tech stack
 */
export async function scanForSchemaFiles(repoPath) {
    const result = {
        detectedTech: [],
        filesAnalyzed: [],
        fileContents: {},
        totalFiles: 0
    };

    // Define patterns to search for
    const patterns = {
        sql: {
            paths: ['**/*.sql', '**/migrations/**/*.sql', '**/schema.sql'],
            tech: 'SQL'
        },
        prisma: {
            paths: ['**/schema.prisma', '**/prisma/schema.prisma'],
            tech: 'Prisma'
        },
        sequelize: {
            paths: ['**/models/**/*.js', '**/models/**/*.ts'],
            tech: 'Sequelize'
        },
        mongoose: {
            paths: ['**/models/**/*.js', '**/models/**/*.ts'],
            tech: 'Mongoose'
        },
        django: {
            paths: ['**/models.py', '**/models/**/*.py'],
            tech: 'Django'
        },
        laravel: {
            paths: ['**/app/Models/**/*.php', '**/database/migrations/**/*.php'],
            tech: 'Laravel'
        },
        rails: {
            paths: ['**/app/models/**/*.rb', '**/db/schema.rb'],
            tech: 'Ruby on Rails'
        }
    };

    // Scan for each pattern
    for (const [key, config] of Object.entries(patterns)) {
        for (const pattern of config.paths) {
            const files = await findFiles(repoPath, pattern);

            if (files.length > 0) {
                if (!result.detectedTech.includes(config.tech)) {
                    result.detectedTech.push(config.tech);
                }

                // Read file contents (limit to first 5 files per pattern)
                for (const file of files.slice(0, 5)) {
                    try {
                        const content = await fs.readFile(file, 'utf-8');
                        const relativePath = path.relative(repoPath, file);

                        result.filesAnalyzed.push(relativePath);
                        result.fileContents[relativePath] = content;
                        result.totalFiles++;
                    } catch (error) {
                        console.warn(`Could not read file ${file}:`, error.message);
                    }
                }
            }
        }
    }

    return result;
}

/**
 * Find files matching a glob pattern
 * @param {string} dir - Directory to search
 * @param {string} pattern - Glob pattern (simplified version)
 * @returns {Promise<string[]>} - Array of file paths
 */
async function findFiles(dir, pattern) {
    const results = [];

    // Convert glob pattern to a simple check
    const patternParts = pattern.split('/').filter(p => p !== '**');
    const fileName = patternParts[patternParts.length - 1];

    async function scan(currentDir) {
        try {
            const entries = await fs.readdir(currentDir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(currentDir, entry.name);

                // Skip node_modules, .git, etc.
                if (entry.name === 'node_modules' || entry.name === '.git' ||
                    entry.name === 'vendor' || entry.name === 'dist' ||
                    entry.name === 'build') {
                    continue;
                }

                if (entry.isDirectory()) {
                    await scan(fullPath);
                } else if (entry.isFile()) {
                    // Check if file matches pattern
                    if (fileName.includes('*')) {
                        const ext = fileName.replace('*', '');
                        if (entry.name.endsWith(ext)) {
                            results.push(fullPath);
                        }
                    } else if (entry.name === fileName || fullPath.includes(fileName)) {
                        results.push(fullPath);
                    }
                }
            }
        } catch (error) {
            // Ignore permission errors
        }
    }

    await scan(dir);
    return results;
}
