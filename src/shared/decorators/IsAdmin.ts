import { SetMetadata } from "@nestjs/common";

export const IS_ADMIN_KEY = "IS_ADMIN";
export const IsAdmin = () => SetMetadata(IS_ADMIN_KEY, true);
