from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain_core.messages import HumanMessage
import json

class DescriptionGenerator:
    def __init__(self, model_name: str = "llama3:latest", base_url: str = "http://localhost:11434"):
        self.llm = ChatOllama(
            model=model_name,
            base_url=base_url
        )
        self.prompt_template = PromptTemplate(
            input_variables=["designation", "yoe", "skills", "extraInfo"],
            template="""Generate a detailed job description for a {designation} with {yoe} years of experience and skills: {skills}. If provided use this additional information: {extraInfo} to provide a more contextual description. If the skills list is empty, use the designation to infer relevant skills.

Return ONLY a valid JSON object in this exact format (no additional text or explanation):

{{
  "designation": "{designation}",
  "experience": {yoe},
  "skills": {skills},
  "description": "Brief job description paragraph (2-3 sentences)",
  "responsibilities": [
    "Responsibility 1",
    "Responsibility 2", 
    "Responsibility 3"
  ],
  "requirements": [
    "Requirement 1",
    "Requirement 2",
    "Requirement 3"
  ]
}}

Generate 3 variations of the job description, each with different wording but similar content. You may increase the content length if necessary, but ensure it remains concise and relevant to the job role. Only return the JSON objects in array format without any additional text or explanation. Do not include any markdown formatting, asterisks, or extra characters in the response. The JSON should be well-structured and easy to parse."""
        )

    def generate_description(self, designation: str, yoe: int, skills: list, extrainfo: str) -> list:
        # Clean up skills - remove empty strings
        cleaned_skills = [skill.strip() for skill in skills if skill.strip()]
        
        # If no valid skills, use empty list
        if not cleaned_skills:
            skills_json = "[]"
        else:
            skills_json = json.dumps(cleaned_skills)
            
        prompt = self.prompt_template.format(
            designation=designation.lower(), 
            yoe=yoe, 
            skills=skills_json,
            extraInfo=extrainfo
        )
        
        try:
            print(f"Sending prompt to Ollama: {prompt[:50]}...")
            response = self.llm([HumanMessage(content=prompt)])
            content = response.content
        except Exception as e:
            print(f"Ollama connection failed: {e}. Switching to MOCK mode.")
            return self._get_mock_data(designation, yoe, cleaned_skills)
        
        try:
            # Try to parse the response as JSON
            result = json.loads(content)
            
            # If it's an array, return it as-is
            if isinstance(result, list):
                return result
            # If it's a single object, wrap it in an array for consistency
            elif isinstance(result, dict):
                return [result]
            else:
                raise ValueError("Unexpected response format")
                
        except (json.JSONDecodeError, ValueError) as e:
            print(f"JSON parsing failed: {e}")
            # Fallback: return an array with a single fallback object
            return [{
                "designation": designation.lower(),
                "experience": yoe,
                "skills": cleaned_skills,
                "description": "Failed to generate description",
                "responsibilities": [],
                "requirements": []
            }]

    def _get_mock_data(self, designation, yoe, skills):
        """Returns mock data when AI is unavailable."""
        return [
            {
                "designation": designation,
                "experience": yoe,
                "skills": skills,
                "description": f"[MOCK] This is a generated description for a {designation}. (Ollama is not running, so this is a placeholder response).",
                "responsibilities": [
                    "Develop high-quality software solutions",
                    "Collaborate with cross-functional teams",
                    "Participate in code reviews and debugging"
                ],
                "requirements": [
                    f"Minimum {yoe} years of experience",
                    "Strong problem-solving skills",
                    f"Proficiency in {', '.join(skills) if skills else 'relevant technologies'}"
                ]
            },
            {
                "designation": designation,
                "experience": yoe,
                "skills": skills,
                "description": f"[MOCK] Variation 2: A simpler description for {designation}. Ensure Ollama is running for real AI generation.",
                "responsibilities": [
                    "Design and implement scalable systems",
                    "Mentor junior developers",
                    "Maintain documentation"
                ],
                "requirements": [
                    "Bachelor's degree in Computer Science",
                    "Excellent communication skills",
                    "Experience with Agile methodologies"
                ]
            }
        ]
