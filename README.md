# 🚀 Autonomous Insurance Claims Processing Agent

An AI-powered backend service that automates FNOL (First Notice of Loss) insurance claim processing through intelligent document parsing, structured data extraction, validation, and rule-based routing.

## ✨ Features

- **📄 Document Processing**: Supports PDF and TXT file uploads
- **🤖 AI Extraction**: Uses OpenRouter API with Mistral for intelligent data extraction
- **✅ Validation Engine**: Detects missing mandatory fields and validates data quality  
- **🔀 Smart Routing**: Priority-based routing with 5 workflow categories
- **📝 Explainable AI**: Generates human-readable routing justifications
- **🔒 Secure**: Input validation, file type checking, size limits
- **🐳 Docker Ready**: Fully containerized for easy deployment
- **🧪 Tested**: Comprehensive test coverage with Jest

## 📸 Interface Preview

<div align="center">
  <img src="assets/screenshots/landing-hero.png" alt="FNOLite Landing Page" width="100%" />
</div>

### Intelligent Claims Console
<div align="center">
  <img src="assets/screenshots/console.png" alt="Claims Processing Console" width="100%" />
</div>

## 🏗️ Architecture

```mermaid
graph TD
    A[Client Upload] --> B[Upload Controller]
    B --> C[PDF/TXT Parser]
    C --> D[LLM Extraction Service]
    D --> E[Validation Engine]
    E --> F[Routing Engine]
    F --> G[Explanation Generator]
    G --> H[JSON Response]
```

## 🎯 Routing Logic

Claims are routed based on priority (highest to lowest):

| Priority | Route | Trigger Condition |
|----------|-------|-------------------|
| 1 | **Investigation** | Fraud indicators detected in description |
| 2 | **Manual Review** | Missing mandatory fields |
| 3 | **Specialist Queue** | Injury/medical claim type |
| 4 | **Fast Track** | Estimated damage < $25,000 |
| 5 | **Standard Processing** | Default for all other claims |

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, TypeScript
- **AI/LLM**: OpenRouter API with Mistral 7B Instruct
- **Validation**: Zod
- **File Processing**: pdf-parse, Multer
- **Testing**: Jest
- **Deployment**: Docker, Docker Compose

## 📋 Prerequisites

- Node.js 20+ or Docker
- OpenRouter API key (free tier available at https://openrouter.ai)

## ⚡ Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Manish881-hub/Autonomous-Insurance-Claims-Processing-Agent.git
   cd Autonomous-Insurance-Claims-Processing-Agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_actual_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

### Docker Deployment

1. **Set environment variable**
   ```bash
   # Windows PowerShell
   $env:OPENROUTER_API_KEY="your_actual_api_key_here"
   
   # Linux/Mac
   export OPENROUTER_API_KEY=your_actual_api_key_here
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

## 📡 API Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "environment": "development",
  "timestamp": "2024-02-20T10:30:00.000Z"
}
```

### Process Claim Document
```http
POST /api/claims/process
Content-Type: multipart/form-data

document: <PDF or TXT file>
```

**Example using curl:**
```bash
curl -X POST http://localhost:3000/api/claims/process \
  -F "document=@test-data/sample-fnol-fast-track.txt"
```

**Example using PowerShell:**
```powershell
$form = @{
    document = Get-Item -Path "test-data\sample-fnol-fast-track.txt"
}
Invoke-RestMethod -Uri "http://localhost:3000/api/claims/process" -Method Post -Form $form
```

**Real API Response Example:**

See [`examples/sample-response.json`](examples/sample-response.json) for a complete real-world API response showing:
- ✅ All extracted fields with actual data
- ✅ Fast Track routing decision
- ✅ Human-readable reasoning explanation
- ✅ Triggered business rules

**Response Summary:**
```json
{
  "extractedFields": { /* Structured policy, incident, and asset data */ },
  "missingFields": [],
  "recommendedRoute": "Fast Track",
  "reasoning": "This claim has been routed to **Fast Track**...",
  "triggeredRules": [
    "Estimated damage ($1850) is below fast track threshold ($25000)"
  ]
}
```

## 🧪 Testing

### Run all tests
```bash
npm test
```

### Run with coverage
```bash
npm run test:coverage
```

### Test with sample documents
The `test-data/` directory contains 5 sample FNOL documents for testing each routing scenario:

- `sample-fnol-complete.txt` → Standard Processing
- `sample-fnol-missing-fields.txt` → Manual Review
- `sample-fnol-injury.txt` → Specialist Queue
- `sample-fnol-fraud.txt` → Investigation
- `sample-fnol-fast-track.txt` → Fast Track

## 📊 Data Extraction Schema

The system extracts the following structured data:

- **Policy Information**: Policy number, policyholder name, effective dates
- **Incident Information**: Date, time, location, description
- **Involved Parties**: Claimant details, third parties, contact information
- **Asset Details**: Asset type, ID, estimated damage
- **Mandatory Fields**: Claim type, attachments, initial estimate

## 🔧 Configuration

Key environment variables (see `.env.example`):

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `OPENROUTER_API_KEY` | OpenRouter API key (optional for free tier) | "" |
| `OPENROUTER_BASE_URL` | OpenRouter API base URL | https://openrouter.ai/api/v1 |
| `MAX_FILE_SIZE_MB` | Max upload size | 10 |
| `LLM_MODEL` | LLM model | mistralai/mistral-7b-instruct |
| `LLM_TEMPERATURE` | Temperature (0-2) | 0 |
| `LLM_MAX_RETRIES` | Retry attempts | 3 |

##  📁 Project Structure

```
src/
├── config/          # Environment and constants
├── controllers/     # Request handlers
├── middleware/      # Upload, error handling
├── routes/          # API route definitions
├── schemas/         # Zod validation schemas
├── services/        # Business logic
│   ├── parser.service.ts       # PDF/TXT parsing
│   ├── extraction.service.ts   # LLM extraction
│   ├── validation.service.ts   # Data validation
│   ├── routing.service.ts      # Routing engine
│   └── explanation.service.ts  # Reasoning generator
├── utils/           # Helper functions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## 🚦 Performance Requirements

- **Maximum file size**: 10MB
- **Response time target**: < 10 seconds
- **Supported formats**: PDF, TXT

## 🔒 Security Features

- MIME type validation
- File size limits
- Automatic file cleanup
- Input sanitization
- Non-root Docker user

## 🐛 Error Handling

The API returns structured error responses:

```json
{
  "error": "Validation Error",
  "message": "Missing required field: policyNumber",
  "timestamp": "2024-02-20T10:30:00.000Z"
}
```

Common error codes:
- `400` - Bad request (invalid file, validation errors)
- `500` - Server error (LLM extraction failed, parsing error)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Developed as part of the Autonomous Insurance Claims Processing System

## 🙏 Acknowledgments

- OpenRouter for providing accessible LLM API access
- Mistral AI for the Mistral 7B Instruct model
- pdf-parse library maintainers
- Express.js and TypeScript communities
