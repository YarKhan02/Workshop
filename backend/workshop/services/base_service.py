# services/base_service.py
from abc import ABC
from typing import Dict, Any, List, Optional
from django.core.exceptions import ValidationError
from rest_framework import status


class BaseService(ABC):
    """
    Base service class that provides common functionality for all services
    """
    
    @staticmethod
    def handle_validation_error(error: ValidationError) -> Dict[str, Any]:
        """
        Convert Django ValidationError to API response format
        """
        return {
            'error': 'Validation failed',
            'details': error.message_dict if hasattr(error, 'message_dict') else str(error)
        }
    
    @staticmethod
    def success_response(message: str, data: Any = None) -> Dict[str, Any]:
        """
        Standard success response format
        """
        response = {'message': message}
        if data is not None:
            response['data'] = data
        return response
    
    @staticmethod
    def error_response(message: str, details: Any = None) -> Dict[str, Any]:
        """
        Standard error response format
        """
        response = {'error': message}
        if details is not None:
            response['details'] = details
        return response
