from rest_framework import serializers

class JobDescriptionRequestSerializer(serializers.Serializer):
    designation = serializers.CharField(max_length=255)
    yoe = serializers.IntegerField(min_value=0, max_value=50)
    skills = serializers.ListField(
        child=serializers.CharField(max_length=100),
        allow_empty=True,
        required=False,
        default=list
    )
    extraInfo = serializers.CharField(allow_blank=True, required=False, default="")

class JobDescriptionResponseSerializer(serializers.Serializer):
    designation = serializers.CharField()
    experience = serializers.IntegerField()
    skills = serializers.ListField(child=serializers.CharField())
    description = serializers.CharField()
    responsibilities = serializers.ListField(child=serializers.CharField())
    requirements = serializers.ListField(child=serializers.CharField())
