# Service Layer Architecture Documentation

## Overview
This document outlines the service layer architecture implemented in the Django workshop application.

## Architecture Benefits

### 1. **Separation of Concerns**
- **Views (Controllers)**: Handle HTTP requests/responses, authentication, authorization
- **Services**: Contain business logic, validation, data processing
- **Models**: Data layer and ORM interactions
- **Serializers**: Data transformation and validation

### 2. **Testability**
- Services can be unit tested independently
- Mock external dependencies easily
- Test business logic without HTTP layer

### 3. **Reusability**
- Business logic can be reused across different views
- Services can be called from management commands, celery tasks, etc.
- Consistent data access patterns

### 4. **Maintainability**
- Clear structure makes code easier to understand
- Changes to business logic are centralized
- Easier to debug and modify

## Project Structure

```
backend/workshop/
├── views/           # HTTP request/response handling
│   ├── customer_view.py
│   ├── invoice_view.py
│   └── ...
├── services/        # Business logic layer
│   ├── __init__.py
│   ├── base_service.py
│   ├── customer_service.py
│   ├── invoice_service.py
│   └── ...
├── models/          # Data models
├── serializers/     # Data serialization
└── queries/         # Complex database queries
```

## Implementation Pattern

### View Layer (HTTP Logic Only)
```python
class CustomerView(viewsets.ViewSet):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.customer_service = CustomerService()

    @action(detail=False, methods=['get'])
    def get_customers(self, request):
        # Extract request parameters
        search = request.query_params.get('search')
        
        # Call service method
        result = self.customer_service.get_customers(search)
        
        # Handle service response
        if 'error' in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(result['data'], status=status.HTTP_200_OK)
```

### Service Layer (Business Logic)
```python
class CustomerService(BaseService):
    def get_customers(self, search_term: Optional[str] = None) -> Dict[str, Any]:
        try:
            # Business logic implementation
            queryset = Customer.objects.all()
            
            if search_term:
                queryset = queryset.filter(
                    Q(first_name__icontains=search_term) |
                    Q(last_name__icontains=search_term)
                )
            
            serializer = CustomerSerializer(queryset, many=True)
            return self.success_response(
                message="Customers retrieved successfully",
                data=serializer.data
            )
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve customers",
                details=str(e)
            )
```

## Standard Response Format

All service methods return standardized responses:

```python
# Success Response
{
    "message": "Operation completed successfully",
    "data": {...}  # Optional
}

# Error Response
{
    "error": "Error description",
    "details": {...}  # Optional error details
}
```

## Implementation Checklist

### For Each Model, Create:

1. **Service Class** (`services/{model}_service.py`)
   - [ ] Inherit from `BaseService`
   - [ ] Implement CRUD operations
   - [ ] Add business logic methods
   - [ ] Handle exceptions properly
   - [ ] Return standardized responses

2. **Refactored View** (`views/{model}_view.py`)
   - [ ] Remove business logic
   - [ ] Keep only HTTP handling
   - [ ] Use service methods
   - [ ] Handle service responses
   - [ ] Map to appropriate HTTP status codes

### Service Method Guidelines

1. **Method Naming**
   - `get_all_{model}s()` - List all items
   - `get_{model}_by_id(id)` - Get single item
   - `create_{model}(data)` - Create new item
   - `update_{model}(id, data)` - Update existing item
   - `delete_{model}(id)` - Delete item

2. **Error Handling**
   - Always use try-catch blocks
   - Return standardized error responses
   - Log errors appropriately
   - Handle specific exceptions (DoesNotExist, ValidationError)

3. **Validation**
   - Use serializers for data validation
   - Add business rule validations
   - Return detailed error messages

## Migration Strategy

1. **Phase 1**: Create base service structure ✅
2. **Phase 2**: Refactor customer and invoice views ✅
3. **Phase 3**: Refactor remaining views
4. **Phase 4**: Add comprehensive testing
5. **Phase 5**: Add logging and monitoring

## Next Steps

To continue implementing this pattern for your remaining views:

1. Use the `generate_service_template.py` script to create service templates
2. Move business logic from views to services
3. Refactor views to use services
4. Add unit tests for services
5. Update error handling throughout the application

## Example Commands to Generate Services

```bash
# In your backend directory
python generate_service_template.py
```

This will generate templates for:
- ProductService
- CarService  
- BookingService
- And more...

Simply copy the generated templates, fill in the TODOs with your specific serializers and logic, and refactor the corresponding views.
