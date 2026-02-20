// Basic environment example validation
// Ensures that the Docker env example contains all required keys
const fs = require('fs')
const path = require('path')

try {
    const repoRoot = path.resolve(__dirname, '..')
    const envPath = path.join(repoRoot, '.env.example')
    if (!fs.existsSync(envPath)) {
        console.error('.env.example is missing at', envPath)
        process.exit(2)
    }
    const content = fs.readFileSync(envPath, 'utf8')

    const requiredKeys = [
        'PORT',
        'DISPATCH_ENABLED',
        'DISPATCH_CONTROLLER_URL',
        'DATABASE_PATH',
        'DATABASE_TYPE',
        'DATABASE_PORT',
        'DATABASE_HOST',
        'DATABASE_NAME',
        'DATABASE_USER',
        'DATABASE_PASSWORD',
        'DATABASE_SSL',
        'DATABASE_SSL_KEY_BASE64',
        'SECRETKEY_STORAGE_TYPE',
        'SECRETKEY_PATH',
        'FLOWISE_SECRETKEY_OVERWRITE',
        'SECRETKEY_AWS_ACCESS_KEY',
        'SECRETKEY_AWS_SECRET_KEY',
        'SECRETKEY_AWS_REGION',
        'SECRETKEY_AWS_NAME',
        'DEBUG',
        'LOG_PATH',
        'LOG_LEVEL',
        'STORAGE_TYPE',
        'BLOB_STORAGE_PATH',
        'S3_STORAGE_BUCKET_NAME',
        'S3_STORAGE_ACCESS_KEY_ID',
        'S3_STORAGE_SECRET_ACCESS_KEY',
        'S3_STORAGE_REGION',
        'S3_ENDPOINT_URL',
        'APP_URL',
        'JWT_AUTH_TOKEN_SECRET',
        'JWT_REFRESH_TOKEN_SECRET',
        'JWT_ISSUER',
        'JWT_AUDIENCE',
        'JWT_TOKEN_EXPIRY_IN_MINUTES',
        'JWT_REFRESH_TOKEN_EXPIRY_IN_MINUTES',
        'MODE',
        'QUEUE_NAME',
        'REDIS_URL',
        'REDIS_HOST',
        'REDIS_PORT',
        'REDIS_PASSWORD'
    ]

    let missing = []
    for (const key of requiredKeys) {
        const re = new RegExp('^' + key + '\s*=', 'm')
        if (!re.test(content)) {
            missing.push(key)
        }
    }

    if (missing.length > 0) {
        console.error('Missing keys in .env.example:', missing.join(', '))
        process.exit(2)
    }

    console.log('OK: .env.example contains all required keys')
    process.exit(0)
} catch (err) {
    console.error('Failed to validate env example:', err && err.message ? err.message : err)
    process.exit(2)
}
