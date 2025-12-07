import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma.service';
import { PaginationDto } from '../common';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }
  async create(createProductDto: CreateProductDto) {
    // return 'This action adds a new product';
    return await this.prisma.product.create({ data: createProductDto });
  }

  async findAll(paginationQuery: PaginationDto) {
    const { page = 1, limit = 10 } = paginationQuery;
    const totalPages = await this.prisma.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true },
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      }
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({ where: { id, available: true } });
    if (!product) throw new NotFoundException(`Product not found with id #${id}`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // return `This action updates a #${id} product`;
    const { id: _, ...data } = updateProductDto;
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product not found with id #${id}`);

    return this.prisma.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number) {
    // return `This action removes a #${id} product`;
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product not found with id #${id}`);

    return this.prisma.product.update({ where: { id }, data: { available: false } });
  }
}
