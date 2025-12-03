import express from 'express';
import { cloneRepository, cleanupRepository } from '../services/gitService.js';
import { scanForSchemaFiles } from '../services/scannerService.js';
import { extractSchemaWithLLM } from '../services/llmService.js';
import { convertToDot } from '../services/dotService.js';

const router = express.Router();

/**
 * POST /api/analyze
 * Analyzes a GitHub repository and generates ER diagram in DOT format
 * 
 * Request body:
 * {
 *   "repoUrl": "https://github.com/user/repo"
 * }
 */
router.post('/', async (req, res) => {
    let repoPath = null;
    try {
        const { repoUrl } = req.body;

        if (!repoUrl) {
            return res.status(400).json({ error: 'Repository URL is required' });
        }

        // Validate GitHub URL
        if (!repoUrl.includes('github.com')) {
            return res.status(400).json({ error: 'Please provide a valid GitHub repository URL' });
        }

        console.log(`📥 Analyzing repository: ${repoUrl}`);

        // Step 1: Clone the repository
        repoPath = await cloneRepository(repoUrl);
        console.log(`✅ Repository cloned to: ${repoPath}`);

        // Step 2: Scan for schema files
        const schemaFiles = await scanForSchemaFiles(repoPath);
        console.log(`✅ Found ${schemaFiles.totalFiles} schema files`);

        if (schemaFiles.totalFiles === 0) {
            return res.status(404).json({
                error: 'No database schema files found',
                message: 'Could not find any SQL files, ORM models, or schema definitions in this repository'
            });
        }

        // Step 3: Extract schema using LLM
        const schemaJson = await extractSchemaWithLLM(schemaFiles);
        const entitiesCount = Object.keys(schemaJson.entities || {}).length;
        console.log(`✅ ER Diagram extracted:`, entitiesCount, 'entities found');

        // Step 4: Convert to DOT format
        const dotString = convertToDot(schemaJson);
        console.log(`✅ DOT diagram generated`);

        // Return the result
        res.json({
            success: true,
            repoUrl,
            detectedTech: schemaFiles.detectedTech,
            filesAnalyzed: schemaFiles.filesAnalyzed,
            schema: schemaJson,
            dotString,
            tablesCount: entitiesCount
        });

    } catch (error) {
        console.error('❌ Error analyzing repository:', error);
        res.status(500).json({
            error: 'Failed to analyze repository',
            message: error.message
        });
    } finally {
        // Cleanup: Delete the cloned repository
        if (repoPath) {
            await cleanupRepository(repoPath);
        }
    }
});

export default router;
