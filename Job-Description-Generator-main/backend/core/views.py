from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import JobDescriptionRequestSerializer
from .services import DescriptionGenerator

# Initialize generator globally to avoid reloading model on every request
try:
    generator = DescriptionGenerator()
    generator_initialized = True
except Exception as e:
    print(f"Failed to initialize generator: {e}")
    generator_initialized = False
    initialization_error = str(e)

class JobDescriptionView(APIView):
    def post(self, request):
        if not generator_initialized:
             return Response({
                "success": False,
                "message": "Job description generator is not properly initialized",
                "error": initialization_error
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = JobDescriptionRequestSerializer(data=request.data)
        if serializer.is_valid():
            try:
                data = serializer.validated_data
                result = generator.generate_description(
                    designation=data['designation'],
                    yoe=data['yoe'],
                    skills=data['skills'],
                    extrainfo=data['extraInfo']
                )
                
                return Response({
                    "success": True,
                    "data": result,
                    "message": f"Successfully generated {len(result)} job description variations",
                    "count": len(result)
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                return Response({
                    "success": False,
                    "message": "An unexpected error occurred",
                    "error": str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({
            "success": False,
            "message": "Invalid input",
            "error": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class HealthCheckView(APIView):
    def get(self, request):
        return Response({
            "status": "healthy",
            "service": "Job Description Generator API (Django)",
            "generator_status": "initialized" if generator_initialized else "failed",
            "message": "API is running successfully"
        })
