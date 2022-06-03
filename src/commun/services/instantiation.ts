import { ServiceIdentifier } from './services';

export namespace _util {
	export const serviceIds = new Map<string, ServiceIdentifier<any>>();

	export const DI_TARGET = '$di$target';
	export const DI_DEPENDENCIES = '$di$dependencies';

	export function getServiceDependencies(ctor: any): { id: ServiceIdentifier<any>, index: number, optional: boolean }[] {
		return ctor[DI_DEPENDENCIES] || [];
	}
}

