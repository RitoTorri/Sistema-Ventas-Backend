import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
  ) {}

  async create(createSupplierDto: CreateSupplierDto) {
    const { rif, email, phone } = createSupplierDto; // Destructuramos los datos

    // Buscamos duplicados
    await this.findDuplicates(rif ?? null, email ?? null, phone ?? null, null);

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
      order: { id_supplier: 'ASC' },
    });

    return {
      data: suppliers,
      meta: {
        totalItems: total,
        totalCounts: suppliers.length,
        itemPerPage: paginationDto.limit,
        totalPages: Math.ceil(total / paginationDto.limit),
        currentPage: paginationDto.page,
      },
    };
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    // Validamos que el proveedor exista
    const supplierById = await this.findById(id);
    if (!supplierById) throw new NotFoundException('No existe el proveedor con ese ID');
    if (!supplierById.active) throw new ConflictException('Este proveedor esta inactivo. No puede ser modificado');

    // Buscamos duplicados
    const { rif = null, email = null, phone = null } = updateSupplierDto;
    await this.findDuplicates(rif ?? null, email ?? null, phone ?? null, id);

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

  async findDuplicates(rif: string | null, email: string | null, phone: string | null, idExclude: number | null) {
    // Condiciones
    const whereConditions: Array<{
      rif?: string;
      email?: string;
      phone?: string;
    }> = [];

    // Agregamos condiciones al array
    if (rif) whereConditions.push({ rif });
    if (email) whereConditions.push({ email });
    if (phone) whereConditions.push({ phone });

    // Si no hay condiciones, devolvemos
    if (whereConditions.length === 0) return;

    // Buscamos duplicados
    const suppliers = await this.supplierRepository.find({
      where: whereConditions,
      select: ['id_supplier', 'rif', 'email', 'phone', 'active'],
      withDeleted: true,
    });

    for (const s of suppliers) {
      if (idExclude && s.id_supplier === idExclude) continue;

      // Verificamos cada campo por separado
      if (rif && s.rif === rif) {
        throw new ConflictException('Ya existe un proveedor con este RIF.');
      }

      if (email && s.email === email) {
        throw new ConflictException('Ya existe un proveedor con este email.');
      }

      if (phone && s.phone === phone) {
        throw new ConflictException('Ya existe un proveedor con este teléfono.');
      }
    }
  }
}
