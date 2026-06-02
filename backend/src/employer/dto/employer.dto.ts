import { IsEnum, IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateApplicationStatusDto {
  @IsEnum(
    ['pending', 'reviewing', 'interview', 'offered', 'rejected'],
    { message: 'Trạng thái không hợp lệ' },
  )
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  status: string;
}

export class BulkDeleteApplicationsDto {
  @IsArray({ message: 'Danh sách ID không hợp lệ' })
  @IsMongoId({ each: true, message: 'ID không đúng định dạng' })
  ids: string[];
}
