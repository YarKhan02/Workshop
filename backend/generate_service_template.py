# generate_service_template.py
"""
Script to generate service layer templates for existing views
"""

def generate_service_template(model_name: str, operations: list) -> str:
    """
    Generate a service class template
    """
    service_name = f"{model_name}Service"
    model_import = f"from workshop.models.{model_name.lower()} import {model_name}"
    
    template = f"""# services/{model_name.lower()}_service.py
from typing import Dict, Any, List, Optional
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist

{model_import}
from workshop.serializers.{model_name.lower()}_serializer import *  # Import your serializers
from .base_service import BaseService


class {service_name}(BaseService):
    \"\"\"
    {model_name} service containing all business logic for {model_name.lower()} operations
    \"\"\"
    
"""
    
    # Generate methods based on operations
    for operation in operations:
        if operation == "list":
            template += f"""    def get_all_{model_name.lower()}s(self) -> Dict[str, Any]:
        \"\"\"
        Retrieve all {model_name.lower()}s
        \"\"\"
        try:
            items = {model_name}.objects.all()
            # TODO: Add your serializer here
            # serializer = {model_name}Serializer(items, many=True)
            return self.success_response(
                message="{model_name}s retrieved successfully",
                data=[]  # Replace with serializer.data
            )
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve {model_name.lower()}s",
                details=str(e)
            )
    
"""
        elif operation == "create":
            template += f"""    def create_{model_name.lower()}(self, data: Dict[str, Any]) -> Dict[str, Any]:
        \"\"\"
        Create a new {model_name.lower()}
        \"\"\"
        try:
            # TODO: Add your create serializer here
            # serializer = {model_name}CreateSerializer(data=data)
            # if serializer.is_valid():
            #     item = serializer.save()
            #     return self.success_response(
            #         message="{model_name} created successfully",
            #         data=serializer.data
            #     )
            # else:
            #     return self.error_response(
            #         message="Invalid {model_name.lower()} data",
            #         details=serializer.errors
            #     )
            pass
        except Exception as e:
            return self.error_response(
                message="Failed to create {model_name.lower()}",
                details=str(e)
            )
    
"""
        elif operation == "update":
            template += f"""    def update_{model_name.lower()}(self, item_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        \"\"\"
        Update an existing {model_name.lower()}
        \"\"\"
        try:
            item = {model_name}.objects.get(pk=item_id)
        except {model_name}.DoesNotExist:
            return self.error_response(
                message="{model_name} not found",
                details=f"{model_name} with ID {{item_id}} does not exist"
            )
        
        try:
            # TODO: Add your update serializer here
            # serializer = {model_name}UpdateSerializer(item, data=data, partial=True)
            # if serializer.is_valid():
            #     updated_item = serializer.save()
            #     return self.success_response(
            #         message="{model_name} updated successfully",
            #         data=serializer.data
            #     )
            # else:
            #     return self.error_response(
            #         message="Invalid {model_name.lower()} data",
            #         details=serializer.errors
            #     )
            pass
        except Exception as e:
            return self.error_response(
                message="Failed to update {model_name.lower()}",
                details=str(e)
            )
    
"""
        elif operation == "delete":
            template += f"""    def delete_{model_name.lower()}(self, item_id: str) -> Dict[str, Any]:
        \"\"\"
        Delete a {model_name.lower()}
        \"\"\"
        try:
            item = {model_name}.objects.get(pk=item_id)
            item.delete()
            
            return self.success_response(
                message="{model_name} deleted successfully"
            )
        except {model_name}.DoesNotExist:
            return self.error_response(
                message="{model_name} not found",
                details=f"{model_name} with ID {{item_id}} does not exist"
            )
        except Exception as e:
            return self.error_response(
                message="Failed to delete {model_name.lower()}",
                details=str(e)
            )
    
"""
    
    return template


# Example usage:
if __name__ == "__main__":
    # Generate templates for common models
    models_config = {
        "Product": ["list", "create", "update", "delete"],
        "Car": ["list", "create", "update", "delete"],
        "Booking": ["list", "create", "update", "delete"],
    }
    
    for model_name, operations in models_config.items():
        template = generate_service_template(model_name, operations)
        filename = f"services/{model_name.lower()}_service.py"
        print(f"Generated template for {model_name}:")
        print("=" * 50)
        print(template)
        print("=" * 50)
        print()
