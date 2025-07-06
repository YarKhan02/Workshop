import User, { UserRole } from '../models/User';
import Customer from '../models/Customer';
import Car from '../models/Car';
import Invoice, { InvoiceStatus, PaymentMethod } from '../models/Invoice';
import InvoiceItem from '../models/InvoiceItem';
import sequelize from '../config/database';

export const seedUsers = async () => {
  try {
    // Check if users already exist
    const userCount = await User.count();
    if (userCount > 0) {
      console.log('Users already exist, skipping seeding');
      return;
    }

    // Create default users
    const users = [
      {
        username: 'admin',
        email: 'admin@cardetailing.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        phone: '1234567890',
        isActive: true
      },
      {
        username: 'accountant',
        email: 'accountant@cardetailing.com',
        password: 'accountant123',
        firstName: 'Accountant',
        lastName: 'User',
        role: UserRole.ACCOUNTANT,
        phone: '1234567891',
        isActive: true
      },
      {
        username: 'staff',
        email: 'staff@cardetailing.com',
        password: 'staff123',
        firstName: 'Staff',
        lastName: 'User',
        role: UserRole.STAFF,
        phone: '1234567892',
        isActive: true
      }
    ];

    for (const userData of users) {
      await User.create(userData);
    }

    console.log('✅ Default users created successfully');
    console.log('📋 Login credentials:');
    console.log('   Admin: admin / admin123');
    console.log('   Accountant: accountant / accountant123');
    console.log('   Staff: staff / staff123');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

export const seedCustomers = async () => {
  try {
    // Check if customers already exist
    const customerCount = await Customer.count();
    if (customerCount > 0) {
      console.log('Customers already exist, skipping seeding');
      return;
    }

    // Create sample customers
    const customers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        gender: 'male' as const,
        emergencyContact: 'Jane Doe',
        emergencyPhone: '1234567891',
        notes: 'Prefers morning appointments',
        isActive: true,
        totalSpent: 2500.00,
        lastVisit: new Date('2024-01-15'),
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        phone: '1234567892',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        gender: 'female' as const,
        emergencyContact: 'Mike Johnson',
        emergencyPhone: '1234567893',
        notes: 'Allergic to certain cleaning products',
        isActive: true,
        totalSpent: 1800.00,
        lastVisit: new Date('2024-01-20'),
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@email.com',
        phone: '1234567894',
        address: '789 Pine Rd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        gender: 'male' as const,
        emergencyContact: 'Lisa Brown',
        emergencyPhone: '1234567895',
        notes: 'Luxury car owner, premium service preferred',
        isActive: true,
        totalSpent: 4200.00,
        lastVisit: new Date('2024-01-18'),
      },
    ];

    for (const customerData of customers) {
      const customer = await Customer.create(customerData);
      
      // Add cars for each customer
      const cars = [
        {
          customerId: customer.id,
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          color: 'Silver',
          licensePlate: 'ABC123',
          vin: '1HGBH41JXMN109186',
          mileage: 45000,
          fuelType: 'gasoline' as const,
          transmission: 'automatic' as const,
          engineSize: '2.5L',
          notes: 'Well maintained',
          isActive: true,
        },
        {
          customerId: customer.id,
          make: 'Honda',
          model: 'Civic',
          year: 2019,
          color: 'Blue',
          licensePlate: 'XYZ789',
          vin: '2T1BURHE0JC123456',
          mileage: 38000,
          fuelType: 'gasoline' as const,
          transmission: 'automatic' as const,
          engineSize: '1.8L',
          notes: 'Minor scratches on rear bumper',
          isActive: true,
        },
      ];

      for (const carData of cars) {
        await Car.create(carData);
      }
    }

    console.log('✅ Sample customers and cars created successfully');
  } catch (error) {
    console.error('❌ Error seeding customers:', error);
  }
};

export const seedInvoices = async () => {
  try {
    // Check if invoices already exist
    const invoiceCount = await Invoice.count();
    if (invoiceCount > 0) {
      console.log('Invoices already exist, skipping seeding');
      return;
    }

    // Get customers for invoice creation
    const customers = await Customer.findAll({ limit: 3 });
    if (customers.length === 0) {
      console.log('No customers found, skipping invoice seeding');
      return;
    }

    // Create sample invoices
    const invoices = [
      {
        invoiceNumber: 'INV-202401-0001',
        customerId: customers[0].id,
        subtotal: 150.00,
        taxAmount: 15.00,
        discountAmount: 0.00,
        totalAmount: 165.00,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CARD,
        dueDate: new Date('2024-01-15'),
        paidDate: new Date('2024-01-14'),
        notes: 'Basic wash and interior cleaning',
        terms: 'Payment due upon completion',
        isActive: true,
      },
      {
        invoiceNumber: 'INV-202401-0002',
        customerId: customers[1].id,
        subtotal: 300.00,
        taxAmount: 30.00,
        discountAmount: 25.00,
        totalAmount: 305.00,
        status: InvoiceStatus.PENDING,
        dueDate: new Date('2024-01-25'),
        notes: 'Full detailing service',
        terms: 'Payment due within 7 days',
        isActive: true,
      },
      {
        invoiceNumber: 'INV-202401-0003',
        customerId: customers[2].id,
        subtotal: 500.00,
        taxAmount: 50.00,
        discountAmount: 0.00,
        totalAmount: 550.00,
        status: InvoiceStatus.OVERDUE,
        dueDate: new Date('2024-01-10'),
        notes: 'Premium detailing with ceramic coating',
        terms: 'Payment due upon completion',
        isActive: true,
      },
    ];

    for (const invoiceData of invoices) {
      const invoice = await Invoice.create(invoiceData);
      
      // Add invoice items
      const items = [
        {
          invoiceId: invoice.id,
          description: 'Basic Car Wash',
          quantity: 1,
          unitPrice: 50.00,
          totalPrice: 50.00,
          isActive: true,
        },
        {
          invoiceId: invoice.id,
          description: 'Interior Detailing',
          quantity: 1,
          unitPrice: 100.00,
          totalPrice: 100.00,
          isActive: true,
        },
      ];

      for (const itemData of items) {
        await InvoiceItem.create(itemData);
      }
    }

    console.log('✅ Sample invoices created successfully');
  } catch (error) {
    console.error('❌ Error seeding invoices:', error);
  }
};

export const runSeeders = async () => {
  try {
    console.log('✅ Database connected for seeding');
    
    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    
    console.log('✅ All seeders completed');
  } catch (error) {
    console.error('❌ Error running seeders:', error);
  }
}; 