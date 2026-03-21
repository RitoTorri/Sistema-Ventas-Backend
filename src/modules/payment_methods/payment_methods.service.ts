import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { PaymentMethod } from './entities/payment_method.entity';
import { CreatePaymentMethodDto } from './dto/create-payment_method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment_method.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
  ) { }

  async create(createPaymentMethodDto: CreatePaymentMethodDto) {
    const existsByName = await this.findByName(createPaymentMethodDto.name);
    if (existsByName) throw new ConflictException('Ya existe un método de pago con ese nombre');

    const paymentMethod = this.paymentMethodRepository.create(createPaymentMethodDto);
    return await this.paymentMethodRepository.save(paymentMethod);
  }

  async findAll(paginationDto: PaginationDto) {
    const [paymentMethods, total] = await this.paymentMethodRepository.findAndCount({
      where: { active: paginationDto.active, name: ILike(`%${paginationDto.param}%`) },
      take: paginationDto.limit,
      skip: (paginationDto.page - 1) * paginationDto.limit,
      select: ['id_payment_method', 'name', 'active'],
      order: {
        id_payment_method: 'DESC',
      },
      withDeleted: true,
    });

    return {
      data: paymentMethods,
      meta: {
        totalItems: total,
        totalCounts: paymentMethods.length,
        itemPerPage: paginationDto.limit,
        totalPages: Math.ceil(total / paginationDto.limit),
        currentPage: paginationDto.page,
      },
    };
  }

  async update(id: number, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    const paymentMethod = await this.findById(id);
    if (!paymentMethod) throw new NotFoundException('No se encontró el método de pago con el id proporcionado');
    if (!paymentMethod.active) throw new ConflictException('El método de pago está inactivo. No puede ser actualizado.');

    if (updatePaymentMethodDto.name) {
      const existsByName = await this.findByName(updatePaymentMethodDto.name);
      if (existsByName && existsByName.id_payment_method !== id) {
        throw new ConflictException('Ya existe un método de pago con ese nombre');
      }
    }

    const updatedPaymentMethod = this.paymentMethodRepository.merge(paymentMethod, updatePaymentMethodDto);
    return await this.paymentMethodRepository.save(updatedPaymentMethod);
  }

  async remove(id: number) {
    const paymentMethod = await this.findById(id);
    if (!paymentMethod) throw new NotFoundException('No se encontró el método de pago con el id proporcionado');
    if (!paymentMethod.active) throw new ConflictException('El método de pago ya está inactivo. No puede ser eliminado nuevamente.');

    paymentMethod.active = false;
    paymentMethod.deleted_at = new Date();
    return await this.paymentMethodRepository.save(paymentMethod);
  }

  async restore(id: number) {
    const paymentMethod = await this.findById(id);
    if (!paymentMethod) throw new NotFoundException('No se encontró el método de pago con el id proporcionado');
    if (paymentMethod.active) throw new ConflictException('El método de pago ya está activo. No puede ser restaurado.');

    paymentMethod.active = true;
    paymentMethod.deleted_at = null;
    return await this.paymentMethodRepository.save(paymentMethod);
  }

  async findById(id: number) {
    return await this.paymentMethodRepository.findOne({
      where: { id_payment_method: id },
      select: ['id_payment_method', 'name', 'active'],
      withDeleted: true,
    });
  }

  async findByName(name: string) {
    return await this.paymentMethodRepository.findOne({
      where: { name },
      select: ['id_payment_method', 'name', 'active'],
      withDeleted: true,
    });
  }
}

