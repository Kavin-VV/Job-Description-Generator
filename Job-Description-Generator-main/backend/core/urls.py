from django.urls import path
from .views import JobDescriptionView, HealthCheckView

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health'),
    path('generate-job-description/', JobDescriptionView.as_view(), name='generate-job-description'),
]
