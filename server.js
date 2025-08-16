import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS setup
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
}));

// Headers for embedding
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', "frame-ancestors *");
  next();
});

// Serve the RFP match tool directly with embedded HTML
app.get('/rfp-match', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RFP Match Tool</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: white;
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .progress-bar {
            width: 100%;
            height: 4px;
            background: rgba(255,255,255,0.1);
            border-radius: 2px;
            margin-bottom: 40px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: #3b82f6;
            transition: width 0.3s ease;
            border-radius: 2px;
        }
        
        .question-container {
            text-align: left;
            max-width: 600px;
        }
        
        .step-indicator {
            color: rgba(255,255,255,0.6);
            font-size: 14px;
            margin-bottom: 10px;
        }
        
        .question {
            font-size: 32px;
            font-weight: bold;
            line-height: 1.2;
            margin-bottom: 30px;
        }
        
        .required {
            color: #ef4444;
        }
        
        .input-container {
            margin-bottom: 30px;
        }
        
        input, textarea, select {
            width: 100%;
            padding: 16px;
            font-size: 18px;
            border: 2px solid rgba(255,255,255,0.2);
            border-radius: 8px;
            background: rgba(255,255,255,0.05);
            color: white;
            outline: none;
            transition: border-color 0.3s ease;
        }
        
        input:focus, textarea:focus, select:focus {
            border-color: #3b82f6;
        }
        
        input::placeholder, textarea::placeholder {
            color: rgba(255,255,255,0.5);
        }
        
        textarea {
            min-height: 120px;
            resize: vertical;
            font-family: inherit;
        }
        
        .checkbox-group, .select-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .checkbox-item, .select-item {
            display: flex;
            align-items: center;
            padding: 16px;
            border: 2px solid rgba(255,255,255,0.2);
            border-radius: 8px;
            background: rgba(255,255,255,0.05);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .checkbox-item:hover, .select-item:hover {
            border-color: rgba(255,255,255,0.4);
            background: rgba(255,255,255,0.1);
        }
        
        .checkbox-item.selected, .select-item.selected {
            border-color: #3b82f6;
            background: rgba(59, 130, 246, 0.1);
        }
        
        .checkbox-item input, .select-item input {
            width: auto;
            margin-right: 12px;
        }
        
        .tags-input {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
            padding: 12px;
            border: 2px solid rgba(255,255,255,0.2);
            border-radius: 8px;
            background: rgba(255,255,255,0.05);
            min-height: 56px;
            cursor: text;
        }
        
        .tags-input:focus-within {
            border-color: #3b82f6;
        }
        
        .tag {
            background: #3b82f6;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .tag-remove {
            cursor: pointer;
            font-weight: bold;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            font-size: 12px;
        }
        
        .tag-remove:hover {
            background: rgba(255,255,255,0.4);
        }
        
        .tag-input {
            flex: 1;
            border: none;
            background: transparent;
            padding: 8px;
            min-width: 120px;
            color: white;
            outline: none;
        }
        
        .tag-input::placeholder {
            color: rgba(255,255,255,0.5);
        }
        
        .budget-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        
        .budget-field {
            display: flex;
            flex-direction: column;
        }
        
        .budget-field label {
            margin-bottom: 8px;
            font-weight: 500;
            color: white;
        }
        
        .buttons {
            display: flex;
            gap: 16px;
            margin-top: 40px;
        }
        
        button {
            padding: 16px 32px;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            flex: 1;
        }
        
        .btn-primary {
            background: #3b82f6;
            color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
            background: #2563eb;
        }
        
        .btn-secondary {
            background: rgba(255,255,255,0.1);
            color: white;
            border: 2px solid rgba(255,255,255,0.2);
        }
        
        .btn-secondary:hover {
            background: rgba(255,255,255,0.2);
        }
        
        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .hint {
            margin-top: 16px;
            font-size: 14px;
            color: rgba(255,255,255,0.6);
        }
        
        .results-container {
            display: none;
            text-align: center;
            padding: 40px 20px;
        }
        
        .results-container.show {
            display: block;
        }
        
        .logo {
            width: 64px;
            height: 64px;
            margin: 0 auto 20px;
            background: white;
            border-radius: 8px;
        }
        
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            font-size: 18px;
        }
        
        .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .error {
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.5);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: left;
        }
        
        .match-result {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 16px;
            text-align: left;
        }
        
        .match-score {
            background: #10b981;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 12px;
        }
        
        .match-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 8px;
            color: white;
        }
        
        .match-agency {
            color: #3b82f6;
            font-weight: 500;
            margin-bottom: 12px;
        }
        
        .match-description {
            color: rgba(255,255,255,0.8);
            line-height: 1.5;
            margin-bottom: 16px;
        }
        
        .match-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
            font-size: 14px;
        }
        
        .match-detail {
            color: rgba(255,255,255,0.7);
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 16px;
            }
            
            .question {
                font-size: 24px;
            }
            
            .budget-group {
                grid-template-columns: 1fr;
            }
            
            .buttons {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="progress-bar">
            <div class="progress-fill" id="progressFill"></div>
        </div>
        
        <div id="questionContainer" class="question-container">
            <!-- Questions will be populated here -->
        </div>
        
        <div id="resultsContainer" class="results-container">
            <div class="logo"></div>
            <h1>Finding Your Matches...</h1>
            <div class="loading" id="loadingIndicator">
                <div class="spinner"></div>
                <span>Analyzing opportunities...</span>
            </div>
            <div id="matchResults"></div>
        </div>
    </div>

    <script>
        // Form configuration
        const questions = [
            {
                id: "company.name",
                question: "What's your company name?",
                type: "text",
                placeholder: "e.g., SpaceX",
                required: true
            },
            {
                id: "company.description",
                question: "Tell us about your company",
                type: "textarea",
                placeholder: "Describe what your company does, your mission, and key achievements...",
                required: true
            },
            {
                id: "company.techCategory",
                question: "Which technology categories best describe your company?",
                type: "checkboxes",
                options: ["Propulsion", "Satellites", "Robotics", "AI/ML", "Earth Observation", "Communications", "Manufacturing", "Materials Science", "Quantum", "Cybersecurity", "Other"],
                required: true
            },
            {
                id: "company.stage",
                question: "What stage is your company at?",
                type: "select",
                options: ["Pre-seed", "Seed", "Series A", "Series B", "Series C+", "Public", "Small Business", "Disadvantaged Business", "Women-Owned Business", "Veteran-Owned Business", "HUBZone"],
                required: true
            },
            {
                id: "company.teamSize",
                question: "What's your team size?",
                type: "select",
                options: ["1-5", "6-15", "16-30", "31-50", "51-100", "101+"],
                required: true
            },
            {
                id: "company.foundedYear",
                question: "When was your company founded?",
                type: "select",
                options: Array.from({length: new Date().getFullYear() - 1950 + 1}, (_, i) => (new Date().getFullYear() - i).toString()),
                required: true
            },
            {
                id: "company.location.city",
                question: "Which city is your company based in?",
                type: "text",
                placeholder: "e.g., Austin",
                required: true
            },
            {
                id: "company.location.state",
                question: "Which state is your company based in?",
                type: "select",
                options: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC", "PR", "VI", "AS", "GU", "MP"],
                required: true
            },
            {
                id: "company.eligibleAgencyCodes",
                question: "Which government agencies would you prefer to work with?",
                type: "checkboxes",
                options: ["NASA", "DOD", "DARPA", "Space Force", "USAF", "Navy", "Army", "DOE", "DHS", "NOAA", "NSF", "NIST", "Any"],
                required: false
            },
            {
                id: "company.email",
                question: "What's your company email?",
                type: "email",
                placeholder: "contact@yourcompany.com",
                required: true
            },
            {
                id: "project.title",
                question: "What's your project title?",
                type: "text",
                placeholder: "Give your project a descriptive name",
                required: true
            },
            {
                id: "project.description",
                question: "Describe your project",
                type: "textarea",
                placeholder: "Describe your project objectives, goals, and expected outcomes...",
                required: true
            },
            {
                id: "project.techSpecs",
                question: "What are the technical specifications?",
                type: "textarea",
                placeholder: "Detail the technical requirements and specifications...",
                required: true
            },
            {
                id: "keywords",
                question: "What keywords best describe your technology and capabilities?",
                type: "tags",
                placeholder: "Type keyword and press Enter",
                required: true
            },
            {
                id: "project.budget",
                question: "What's your estimated budget range?",
                type: "budget",
                required: true
            },
            {
                id: "project.timeline",
                question: "What's your preferred project timeline?",
                type: "select",
                options: ["Immediate (0-3 months)", "Short-term (3-6 months)", "6-12 months", "12-18 months", "18-24 months", "24-36 months", "Long-term (36+ months)", "Flexible timeline"],
                required: true
            }
        ];

        // Form state
        let currentStep = 0;
        let formData = {};

        // Initialize the form
        function init() {
            showQuestion(currentStep);
        }

        // Show current question
        function showQuestion(stepIndex) {
            const question = questions[stepIndex];
            const container = document.getElementById('questionContainer');
            const progressFill = document.getElementById('progressFill');
            
            // Update progress
            progressFill.style.width = \`\${((stepIndex + 1) / questions.length) * 100}%\`;
            
            container.innerHTML = \`
                <div class="step-indicator">\${stepIndex + 1} → \${questions.length}</div>
                <div class="question">
                    \${question.question}
                    \${question.required ? '<span class="required">*</span>' : ''}
                </div>
                <div class="input-container">
                    \${renderInput(question, stepIndex)}
                </div>
                <div class="buttons">
                    \${stepIndex > 0 ? '<button type="button" class="btn-secondary" onclick="previousQuestion()">Back</button>' : ''}
                    <button type="button" class="btn-primary" id="nextBtn" onclick="nextQuestion()" \${!canProceed(question) ? 'disabled' : ''}>
                        \${stepIndex === questions.length - 1 ? 'Submit' : 'Next'}
                    </button>
                </div>
                \${!['checkboxes', 'select', 'budget'].includes(question.type) ? '<div class="hint">Press Enter to continue</div>' : ''}
            \`;
            
            // Add event listeners
            setupEventListeners(question, stepIndex);
        }

        // Render input based on question type
        function renderInput(question, stepIndex) {
            const currentValue = getNestedValue(formData, question.id);
            
            switch (question.type) {
                case 'text':
                case 'email':
                    return \`<input type="\${question.type}" id="input_\${stepIndex}" value="\${currentValue || ''}" placeholder="\${question.placeholder || ''}" />\`;
                
                case 'textarea':
                    return \`<textarea id="input_\${stepIndex}" placeholder="\${question.placeholder || ''}">\${currentValue || ''}</textarea>\`;
                
                case 'select':
                    return \`
                        <div class="select-group">
                            \${question.options.map(option => \`
                                <div class="select-item \${currentValue === option ? 'selected' : ''}" data-value="\${option}">
                                    <span>\${option}</span>
                                </div>
                            \`).join('')}
                        </div>
                    \`;
                
                case 'checkboxes':
                    return \`
                        <div class="checkbox-group">
                            \${question.options.map(option => \`
                                <div class="checkbox-item \${Array.isArray(currentValue) && currentValue.includes(option) ? 'selected' : ''}" data-value="\${option}">
                                    <input type="checkbox" \${Array.isArray(currentValue) && currentValue.includes(option) ? 'checked' : ''} />
                                    <span>\${option}</span>
                                </div>
                            \`).join('')}
                        </div>
                    \`;
                
                case 'tags':
                    return \`
                        <div class="tags-input" id="tagsInput_\${stepIndex}" onclick="focusTagInput(\${stepIndex})">
                            \${Array.isArray(currentValue) ? currentValue.map(tag => \`
                                <span class="tag">\${tag}<span class="tag-remove" onclick="removeTag('\${tag}', \${stepIndex})">&times;</span></span>
                            \`).join('') : ''}
                            <input type="text" class="tag-input" id="tagInput_\${stepIndex}" placeholder="\${question.placeholder || ''}" />
                        </div>
                    \`;
                
                case 'budget':
                    return \`
                        <div class="budget-group">
                            <div class="budget-field">
                                <label>Minimum Budget ($)</label>
                                <input type="number" id="budgetMin_\${stepIndex}" value="\${currentValue?.min || ''}" placeholder="100000" />
                            </div>
                            <div class="budget-field">
                                <label>Maximum Budget ($)</label>
                                <input type="number" id="budgetMax_\${stepIndex}" value="\${currentValue?.max || ''}" placeholder="500000" />
                            </div>
                        </div>
                    \`;
                
                default:
                    return '';
            }
        }

        // Setup event listeners for current question
        function setupEventListeners(question, stepIndex) {
            const nextBtn = document.getElementById('nextBtn');
            
            switch (question.type) {
                case 'text':
                case 'email':
                case 'textarea':
                    const input = document.getElementById(\`input_\${stepIndex}\`);
                    input.addEventListener('input', () => {
                        updateFormData(question.id, input.value);
                        updateNextButton(question);
                    });
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter' && question.type !== 'textarea' && canProceed(question)) {
                            nextQuestion();
                        }
                    });
                    input.focus();
                    break;
                
                case 'select':
                    document.querySelectorAll('.select-item').forEach(item => {
                        item.addEventListener('click', () => {
                            document.querySelectorAll('.select-item').forEach(i => i.classList.remove('selected'));
                            item.classList.add('selected');
                            updateFormData(question.id, item.dataset.value);
                            updateNextButton(question);
                        });
                    });
                    break;
                
                case 'checkboxes':
                    document.querySelectorAll('.checkbox-item').forEach(item => {
                        item.addEventListener('click', () => {
                            const checkbox = item.querySelector('input[type="checkbox"]');
                            checkbox.checked = !checkbox.checked;
                            item.classList.toggle('selected');
                            
                            const currentValue = getNestedValue(formData, question.id) || [];
                            const value = item.dataset.value;
                            
                            if (checkbox.checked) {
                                updateFormData(question.id, [...currentValue, value]);
                            } else {
                                updateFormData(question.id, currentValue.filter(v => v !== value));
                            }
                            updateNextButton(question);
                        });
                    });
                    break;
                
                case 'tags':
                    const tagInput = document.getElementById(\`tagInput_\${stepIndex}\`);
                    tagInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = tagInput.value.trim();
                            if (value) {
                                addTag(value, stepIndex);
                                tagInput.value = '';
                            }
                        }
                    });
                    tagInput.focus();
                    break;
                
                case 'budget':
                    const minInput = document.getElementById(\`budgetMin_\${stepIndex}\`);
                    const maxInput = document.getElementById(\`budgetMax_\${stepIndex}\`);
                    
                    [minInput, maxInput].forEach(input => {
                        input.addEventListener('input', () => {
                            updateFormData(question.id, {
                                min: Number(minInput.value),
                                max: Number(maxInput.value)
                            });
                            updateNextButton(question);
                        });
                    });
                    minInput.focus();
                    break;
            }
        }

        // Focus tag input when clicking on tags container
        function focusTagInput(stepIndex) {
            const tagInput = document.getElementById(\`tagInput_\${stepIndex}\`);
            if (tagInput) tagInput.focus();
        }

        // Add tag
        function addTag(tag, stepIndex) {
            if (!tag) return;
            
            const question = questions[stepIndex];
            const currentTags = getNestedValue(formData, question.id) || [];
            
            if (!currentTags.includes(tag)) {
                updateFormData(question.id, [...currentTags, tag]);
                showQuestion(stepIndex); // Refresh to show new tag
            }
        }

        // Remove tag
        function removeTag(tag, stepIndex) {
            const question = questions[stepIndex];
            const currentTags = getNestedValue(formData, question.id) || [];
            updateFormData(question.id, currentTags.filter(t => t !== tag));
            showQuestion(stepIndex); // Refresh to remove tag
        }

        // Update form data
        function updateFormData(path, value) {
            setNestedValue(formData, path, value);
        }

        // Get nested value
        function getNestedValue(obj, path) {
            return path.split('.').reduce((current, key) => current?.[key], obj);
        }

        // Set nested value
        function setNestedValue(obj, path, value) {
            const keys = path.split('.');
            const lastKey = keys.pop();
            const target = keys.reduce((current, key) => {
                if (!current[key]) current[key] = {};
                return current[key];
            }, obj);
            target[lastKey] = value;
        }

        // Check if can proceed
        function canProceed(question) {
            if (!question.required) return true;
            
            const value = getNestedValue(formData, question.id);
            
            switch (question.type) {
                case 'checkboxes':
                case 'tags':
                    return Array.isArray(value) && value.length > 0;
                case 'budget':
                    return value?.min && value?.max;
                default:
                    return value && value.toString().trim().length > 0;
            }
        }

        // Update next button state
        function updateNextButton(question) {
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) {
                nextBtn.disabled = !canProceed(question);
            }
        }

        // Next question
        function nextQuestion() {
            const question = questions[currentStep];
            
            if (!canProceed(question)) {
                return;
            }
            
            if (currentStep === questions.length - 1) {
                submitForm();
            } else {
                currentStep++;
                showQuestion(currentStep);
            }
        }

        // Previous question
        function previousQuestion() {
            if (currentStep > 0) {
                currentStep--;
                showQuestion(currentStep);
            }
        }

        // Submit form
        async function submitForm() {
            const container = document.getElementById('questionContainer');
            const resultsContainer = document.getElementById('resultsContainer');
            
            container.style.display = 'none';
            resultsContainer.classList.add('show');
            
            try {
                // Transform data to match backend expectations
                const backendData = {
                    company: {
                        name: formData.company?.name || '',
                        description: formData.company?.description || '',
                        website: formData.company?.website || '',
                        patents: formData.company?.patents || '',
                        techCategory: formData.company?.techCategory || [],
                        eligibleAgencyCodes: formData.company?.eligibleAgencyCodes || [],
                        preferredDepartments: formData.company?.preferredDepartments || [],
                        stage: formData.company?.stage || '',
                        teamSize: formData.company?.teamSize || '',
                        foundedYear: formData.company?.foundedYear || '',
                        email: formData.company?.email || '',
                        location: {
                            city: formData.company?.location?.city || '',
                            state: formData.company?.location?.state || ''
                        }
                    },
                    project: {
                        title: formData.project?.title || '',
                        description: formData.project?.description || '',
                        techSpecs: formData.project?.techSpecs || '',
                        budget: formData.project?.budget ? \`$\${formData.project.budget.min} - $\${formData.project.budget.max}\` : '',
                        timeline: formData.project?.timeline || '',
                        interests: formData.project?.interests || [],
                        deadline: formData.project?.deadline || ''
                    },
                    keywords: formData.keywords || []
                };
                
                console.log('Submitting data:', backendData);
                
                const response = await fetch('https://aero-matching-backend-5d1bd860f515.herokuapp.com/api/match', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(backendData)
                });
                
                if (!response.ok) {
                    throw new Error(\`HTTP \${response.status}: \${await response.text()}\`);
                }
                
                const result = await response.json();
                displayResults(result);
                
            } catch (error) {
                console.error('Error submitting form:', error);
                displayError(error.message);
            }
        }

        // Display results
        function displayResults(result) {
            const matchResults = document.getElementById('matchResults');
            const loading = document.getElementById('loadingIndicator');
            
            loading.style.display = 'none';
            
            if (result.matches && result.matches.length > 0) {
                matchResults.innerHTML = \`
                    <h2 style="margin-bottom: 24px;">Found \${result.matches.length} Matching Opportunities</h2>
                    \${result.matches.map(match => \`
                        <div class="match-result">
                            <div class="match-score">\${Math.round(match.score * 100)}% Match</div>
                            <div class="match-title">\${match.opportunity.title}</div>
                            <div class="match-agency">\${match.opportunity.agency}</div>
                            <div class="match-description">\${match.opportunity.description?.substring(0, 200)}...</div>
                            <div class="match-details">
                                <div class="match-detail"><strong>Posted:</strong> \${new Date(match.opportunity.postedDate).toLocaleDateString()}</div>
                                <div class="match-detail"><strong>Deadline:</strong> \${new Date(match.opportunity.responseDeadline).toLocaleDateString()}</div>
                                <div class="match-detail"><strong>Award Amount:</strong> \${match.opportunity.awardAmount ? ' + match.opportunity.awardAmount.toLocaleString() : 'Not specified'}</div>
                                <div class="match-detail"><strong>Confidence:</strong> \${match.confidenceLevel}</div>
                            </div>
                        </div>
                    \`).join('')}
                    <button class="btn-secondary" onclick="resetForm()" style="margin-top: 24px; width: auto;">Start New Match</button>
                \`;
            } else {
                matchResults.innerHTML = \`
                    <h2>No Matches Found</h2>
                    <p>We couldn't find any opportunities matching your criteria at this time. Please try again later or modify your search criteria.</p>
                    <button class="btn-secondary" onclick="resetForm()" style="margin-top: 24px; width: auto;">Start New Match</button>
                \`;
            }
        }

        // Display error
        function displayError(errorMessage) {
            const matchResults = document.getElementById('matchResults');
            const loading = document.getElementById('loadingIndicator');
            
            loading.style.display = 'none';
            
            matchResults.innerHTML = \`
                <div class="error">
                    <h3>Error Occurred</h3>
                    <p>\${errorMessage}</p>
                    <p>Please check your connection and try again.</p>
                </div>
                <button class="btn-secondary" onclick="resetForm()" style="margin-top: 24px; width: auto;">Try Again</button>
            \`;
        }

        // Reset form
        function resetForm() {
            currentStep = 0;
            formData = {};
            document.getElementById('questionContainer').style.display = 'block';
            document.getElementById('resultsContainer').classList.remove('show');
            showQuestion(currentStep);
        }

        // Initialize the form when page loads
        document.addEventListener('DOMContentLoaded', function() {
            init();
        });
    </script>
</body>
</html>`);
});

// Serve static files from public
app.use('/public', express.static(path.join(__dirname, 'public')));

// Try to serve React app, but don't fail if dist doesn't exist
try {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Only set up React routing if dist/index.html exists
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    try {
      res.sendFile(indexPath);
    } catch (error) {
      res.status(404).send('React app not built');
    }
  });
} catch (error) {
  console.log('React dist folder not found - serving only static files');
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`RFP Match: https://imfo-intelligence-756b7e94aea3.herokuapp.com/rfp-match`);
});
