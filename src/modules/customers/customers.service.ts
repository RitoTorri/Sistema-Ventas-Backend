import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const { ci, email, phone } = createCustomerDto; // Destructuramos los datos

    // Buscamos duplicados
    await this.findDuplicates(ci, email ?? null, phone ?? null);

    const createdCustomer = this.customerRepository.create(createCustomerDto);
    return await this.customerRepository.save(createdCustomer);
  }

  async findAll(paginationDto: PaginationDto) {
    const [customers, total] = await this.customerRepository.findAndCount({
      where: [
        {
          active: paginationDto.active,
          first_name: ILike(`%${paginationDto.param}%`),
        },
        {
          active: paginationDto.active,
          last_name: ILike(`%${paginationDto.param}%`),
        },
        { active: paginationDto.active, ci: paginationDto.param },
      ],
      take: paginationDto.limit,
      skip: (paginationDto.page - 1) * paginationDto.limit,
      select: ['id_customer', 'first_name', 'last_name', 'ci', 'email', 'phone', 'active'],
      order: {
        id_customer: 'ASC',
      }
    });

    return {
      data: customers,
      meta: {
        totalItems: total,
        totalCounts: customers.length,
        itemPerPage: paginationDto.limit,
        totalPages: Math.ceil(total / paginationDto.limit),
        currentPage: paginationDto.page,
      },
    };
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const isCustomerExistsById = await this.findById(id);
    if (!isCustomerExistsById) {
      throw new NotFoundException('No se encontró un cliente con el id proporcionado');
    }
    if (!isCustomerExistsById.active) {
      throw new ConflictException('El cliente ya está eliminado. No puede ser actualizado.');
    }

    // Definimos condiciones de actualización
    const { ci = null, email = null, phone = null } = updateCustomerDto;

    // Buscamos duplicados
    await this.findDuplicatesForUpdate(id, ci, email, phone);

    const updatedCustomer = this.customerRepository.merge(isCustomerExistsById, updateCustomerDto);
    return await this.customerRepository.save(updatedCustomer);
  }

  async remove(id: number) {
    const customer = await this.findById(id);

    if (!customer) {
      throw new NotFoundException('No se encontró un cliente con el id proporcionado');
    }

    if (!customer.active) {
      throw new ConflictException('Este cliente ya está eliminado. No puede ser eliminado nuevamente.');
    }

    customer.active = false;
    customer.deleted_at = new Date();
    return await this.customerRepository.save(customer);
  }

  async restore(id: number) {
    const customer = await this.findById(id);
    if (!customer) throw new NotFoundException('No se encontró un cliente con el id proporcionado');
    if (customer.active) throw new ConflictException('El cliente ya está activo. No puede ser restaurado.');

    customer.active = true;
    customer.deleted_at = null;
    return await this.customerRepository.save(customer);
  }

  async findByEmail(email: string) {
    return await this.customerRepository.findOne({
      where: { email: email },
      select: ['id_customer', 'first_name', 'last_name', 'ci', 'email', 'phone', 'active'],
      withDeleted: true,
    });
  }

  async findByCi(ci: string) {
    return await this.customerRepository.findOne({
      where: { ci: ci },
      select: ['id_customer', 'first_name', 'last_name', 'ci', 'email', 'phone', 'active'],
      withDeleted: true,
    });
  }

  async findById(id: number) {
    return await this.customerRepository.findOne({
      where: { id_customer: id },
      select: ['id_customer', 'first_name', 'last_name', 'ci', 'email', 'phone', 'active'],
      withDeleted: true,
    });
  }

  async findByPhone(phone: string) {
    return await this.customerRepository.findOne({
      where: { phone: phone },
      select: ['id_customer', 'first_name', 'last_name', 'email', 'phone', 'active'],
      withDeleted: true,
    });
  }

  // Busqueda de datos duplicados
  async findDuplicates(ci: string | null, email: string | null, phone: string | null) {
    // Condiciones
    const whereConditions: Array<{
      ci?: string;
      email?: string;
      phone?: string;
    }> = [];

    // Agregamos condiciones al array
    if (ci) whereConditions.push({ ci: ci });
    if (email) whereConditions.push({ email: email });
    if (phone) whereConditions.push({ phone: phone });

    // Si no hay condiciones, devolvemos
    if (whereConditions.length === 0) return;

    // Buscamos duplicados
    const customer = await this.customerRepository.find({
      where: whereConditions,
      select: ['id_customer', 'ci', 'email', 'phone', 'active'],
      withDeleted: true,
    });

    // Verificamos cada campo por separado
    if (ci && customer.some((c) => c.ci === ci)) {
      throw new ConflictException('Ya existe un cliente con esta cédula.');
    }

    if (email && customer.some((c) => c.email === email)) {
      throw new ConflictException('Ya existe un cliente con este email.');
    }

    if (phone && customer.some((c) => c.phone === phone)) {
      throw new ConflictException('Ya existe un cliente con este teléfono.');
    }
  }

  async findDuplicatesForUpdate(id: number, ci: string | null, email: string | null, phone: string | null) {
    // Condiciones
    const whereConditions: Array<{
      ci?: string;
      email?: string;
      phone?: string;
    }> = [];

    // Agregamos condiciones al array
    if (ci) whereConditions.push({ ci: ci });
    if (email) whereConditions.push({ email: email });
    if (phone) whereConditions.push({ phone: phone });

    // Si no hay condiciones, devolvemos
    if (whereConditions.length === 0) return;

    // Buscamos duplicados
    const customer = await this.customerRepository.find({
      where: whereConditions,
      select: ['id_customer', 'ci', 'email', 'phone', 'active'],
      withDeleted: true,
    });

    // Verificamos cada campo por separado
    if (ci && customer.some((c) => c.ci === ci && c.id_customer !== id)) {
      throw new ConflictException('Ya existe un cliente con esta cédula.');
    }

    if (email && customer.some((c) => c.email === email && c.id_customer !== id)) {
      throw new ConflictException('Ya existe un cliente con este email.');
    }

    if (phone && customer.some((c) => c.phone === phone && c.id_customer !== id)) {
      throw new ConflictException('Ya existe un cliente con este teléfono.');
    }
  }
}
