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
  ) { }

  async create(createCustomerDto: CreateCustomerDto) {
    // Validamos que el email no esté repetido
    if (createCustomerDto.email) {
      const customerByEmail = await this.findByEmail(createCustomerDto.email);
      if (customerByEmail) throw new ConflictException('Ya existe un cliente con este email.');
    }

    // Validamos que el teléfono no esté repetido
    if (createCustomerDto.phone) {
      const customerByPhone = await this.findByPhone(createCustomerDto.phone);
      if (customerByPhone) throw new ConflictException('Ya existe un cliente con este teléfono.');
    }

    // Validamos que la cédula no esté repetida
    const customerByCi = await this.findByCi(createCustomerDto.ci);
    if (customerByCi) throw new ConflictException('Ya existe un cliente con esta cédula.');

    const createdCustomer = this.customerRepository.create(createCustomerDto);
    return await this.customerRepository.save(createdCustomer);
  }

  async findAll(paginationDto: PaginationDto) {
    const [customers, total] = await this.customerRepository.findAndCount({
      where: [
        { active: paginationDto.active, first_name: ILike(`%${paginationDto.param}%`) },
        { active: paginationDto.active, last_name: ILike(`%${paginationDto.param}%`) },
        { active: paginationDto.active, ci: paginationDto.param }
      ],
      take: paginationDto.limit,
      skip: (paginationDto.page - 1) * paginationDto.limit,
      select: ['id_customer', 'first_name', 'last_name', 'ci', 'email', 'phone', 'active'],
      order: {
        id_customer: 'DESC',
      },
      withDeleted: true,
    });

    return {
      data: customers,
      meta: {
        totalItems: total,
        totalCounts: customers.length,
        itemPerPage: paginationDto.limit,
        totalPages: Math.ceil(total / paginationDto.limit),
        currentPage: paginationDto.page
      }
    }
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const isCustomerExistsById = await this.findById(id);
    if (!isCustomerExistsById) throw new NotFoundException('No se encontró un cliente con el id proporcionado');
    if (!isCustomerExistsById.active) throw new ConflictException('El cliente ya está eliminado. No puede ser actualizado.');

    if (updateCustomerDto.email) {
      const isEmailCustomerAlreadyExists = await this.findByEmail(updateCustomerDto.email);
      if (isEmailCustomerAlreadyExists && isEmailCustomerAlreadyExists.id_customer !== id) throw new ConflictException('Ya existe un cliente con este email.');
    }

    if (updateCustomerDto.phone) {
      const isPhoneCustomerAlreadyExists = await this.findByPhone(updateCustomerDto.phone);
      if (isPhoneCustomerAlreadyExists && isPhoneCustomerAlreadyExists.id_customer !== id) throw new ConflictException('Ya existe un cliente con este teléfono.');
    }

    if (updateCustomerDto.ci) {
      const isCiCustomerAlreadyExists = await this.findByCi(updateCustomerDto.ci);
      if (isCiCustomerAlreadyExists && isCiCustomerAlreadyExists.id_customer !== id) throw new ConflictException('Ya existe un cliente con esta cédula.');
    }

    const updatedCustomer = this.customerRepository.merge(isCustomerExistsById, updateCustomerDto);
    return await this.customerRepository.save(updatedCustomer)
  }

  async remove(id: number) {
    const customer = await this.findById(id);
    if (!customer) throw new NotFoundException('No se encontró un cliente con el id proporcionado');
    if (!customer.active) throw new ConflictException('Este cliente ya está eliminado. No puede ser eliminado nuevamente.');

    customer.active = false;
    customer.deleted_at = new Date()
    return await this.customerRepository.save(customer)
  }

  async restore(id: number) {
    const customer = await this.findById(id);
    if (!customer) throw new NotFoundException('No se encontró un cliente con el id proporcionado');
    if (customer.active) throw new ConflictException('El cliente ya está activo. No puede ser restaurado.');

    customer.active = true;
    customer.deleted_at = null;
    return await this.customerRepository.save(customer)
  }

  async findByEmail(email: string) {
    return await this.customerRepository.findOne({
      where: { email: email },
      select: ['id_customer', 'first_name', 'last_name', 'ci', 'email', 'phone', 'active'],
      withDeleted: true
    });
  }

  async findByCi(ci: string) {
    return await this.customerRepository.findOne({
      where: { ci: ci },
      select: ['id_customer', 'first_name', 'last_name', 'ci', 'email', 'phone', 'active'],
      withDeleted: true
    });
  }

  async findById(id: number) {
    return await this.customerRepository.findOne({
      where: { id_customer: id },
      select: ['id_customer', 'first_name', 'last_name', 'ci', 'email', 'phone', 'active'],
      withDeleted: true
    });
  }

  async findByPhone(phone: string) {
    return await this.customerRepository.findOne({
      where: { phone: phone },
      select: ['id_customer', 'first_name', 'last_name', 'email', 'phone', 'active'],
      withDeleted: true
    });
  }
}
