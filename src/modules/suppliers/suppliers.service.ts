import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Repository, ILike } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) { }

  async create(createSupplierDto: CreateSupplierDto) {
    // validamos que no exista el mismo RIF
    const supllierByRif = await this.findByRif(createSupplierDto.rif);
    if (supllierByRif) {
      throw new ConflictException('El RIF ya está registrado para otro proveedor',);
    }

    // Validamos que no exista el mismo email
    if (createSupplierDto.email) {
      const supplierByEmail = await this.findByEmail(createSupplierDto.email);
      if (supplierByEmail) {
        throw new ConflictException('El email ya está registrado para otro proveedor',);
      }
    }

    // Validamos que no exista el mismo phone
    const supplierByPhone = await this.findByPhone(createSupplierDto.phone);
    if (supplierByPhone) {
      throw new ConflictException('El número telefónico ya está registrado para otro proveedor');
    }

    // Creamos e insertamos el nuevo proveedor
    const newSupplier = this.supplierRepository.create(createSupplierDto);
    return await this.supplierRepository.save(newSupplier);
  }

  async findAll(paginationDto: PaginationDto) {
    const [suppliers, total] = await this.supplierRepository.findAndCount({
      where: [
        { active: paginationDto.active, company_name: ILike(`%${paginationDto.param}%`) },
        { active: paginationDto.active, contact_name: ILike(`%${paginationDto.param}%`) },
        { active: paginationDto.active, rif: paginationDto.param?.toUpperCase() },
      ],
      select: ['id_supplier', 'rif', 'company_name', 'contact_name', 'email', 'phone', 'address', 'active'],
      skip: paginationDto.limit * (paginationDto.page - 1),
      take: paginationDto.limit,
      withDeleted: true,
    });

    return {
      data: suppliers,
      meta: {
        totalItems: total,
        totalCounts: suppliers.length,
        itemPerPage: paginationDto.limit,
        totalPages: Math.ceil(total / paginationDto.limit),
        currentPage: paginationDto.page
      }
    }
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    // Validamos que el proveedor exista
    const supplierById = await this.findById(id);
    if (!supplierById) throw new NotFoundException('No existe el proveedor con ese ID');
    if (!supplierById.active) throw new ConflictException('Este proveedor esta inactivo. No puede ser modificado');

    // validamos que no exista el mismo RIF
    if (updateSupplierDto.rif) {
      const supllierByRif = await this.findByRif(updateSupplierDto.rif);
      if (supllierByRif) {
        throw new ConflictException('El RIF ya está registrado para otro proveedor',);
      }
    }

    // Validamos que no exista el mismo email
    if (updateSupplierDto.email) {
      const supplierByEmail = await this.findByEmail(updateSupplierDto.email);
      if (supplierByEmail) {
        throw new ConflictException('El email ya está registrado para otro proveedor',);
      }
    }

    // Validamos que no exista el mismo phone
    if (updateSupplierDto.phone) {
      const supplierByPhone = await this.findByPhone(updateSupplierDto.phone);
      if (supplierByPhone) {
        throw new ConflictException('El número telefónico ya está registrado para otro proveedor');
      }
    }

    // Actualizamos el proveedor
    supplierById.updated_at = new Date();
    const supplierUpdated = this.supplierRepository.merge(supplierById, updateSupplierDto);
    return await this.supplierRepository.save(supplierUpdated);
  }

  async restore(id: number) {
    // Validamos que el proveedor exista
    const supplierById = await this.findById(id);
    if (!supplierById) throw new NotFoundException('No existe el proveedor con ese ID');
    if (supplierById.active) throw new ConflictException('El proveedor ya se encuentra restaurado');

    // Restauramos el proveedor
    supplierById.active = true;
    supplierById.deleted_at = null;
    return await this.supplierRepository.save(supplierById);
  }

  async remove(id: number) {
    // VAlidamos que el proveedor exista
    const supplierById = await this.findById(id);
    if (!supplierById) throw new NotFoundException('No existe el proveedor con ese ID');
    if (!supplierById.active) throw new ConflictException('El proveedor ya se encuentra eliminado');

    // Eliminamos el proveedor
    supplierById.active = false;
    supplierById.deleted_at = new Date();
    return await this.supplierRepository.save(supplierById);
  }

  async findByRif(rif: string) {
    return await this.supplierRepository.findOne({
      where: { rif: rif },
      select: ['id_supplier', 'rif', 'company_name', 'contact_name', 'email', 'phone', 'address', 'active'],
      withDeleted: true,
    });
  }

  async findByEmail(email: string) {
    return await this.supplierRepository.findOne({
      where: { email: email },
      select: ['id_supplier', 'rif', 'company_name', 'contact_name', 'email', 'phone', 'address', 'active'],
      withDeleted: true,
    });
  }

  async findByPhone(phone: string) {
    return await this.supplierRepository.findOne({
      where: { phone: phone },
      select: ['id_supplier', 'rif', 'company_name', 'contact_name', 'email', 'phone', 'address', 'active'],
      withDeleted: true,
    });
  }

  async findById(id: number) {
    return await this.supplierRepository.findOne({
      where: { id_supplier: id },
      select: ['id_supplier', 'rif', 'company_name', 'contact_name', 'email', 'phone', 'address', 'active'],
      withDeleted: true,
    });
  }
}
