import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma.service';
import { PaginationDto } from '../common';
import { RpcException } from '@nestjs/microservices';

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
    if (!product) {
      throw new RpcException({ message: `Product not found with id #${id}`, status: HttpStatus.BAD_REQUEST });
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // return `This action updates a #${id} product`;
    const { id: _, ...data } = updateProductDto;
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new RpcException(`Product not found with id #${id}`);

    return this.prisma.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number) {
    // return `This action removes a #${id} product`;
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new RpcException(`Product not found with id #${id}`);

    return this.prisma.product.update({ where: { id }, data: { available: false } });
  }

  async validateProducts(ids: number[]) {
    ids = Array.from(new Set(ids)); // Remove duplicates
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: ids },
        available: true,
      },
    });

    if (products.length !== ids.length) {
      throw new RpcException({
        message: 'One or more products are invalid or unavailable',
        status: HttpStatus.BAD_REQUEST
      });
    }

    return products;
  }
}
