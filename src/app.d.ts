import { User } from '$/types';
import type { Admin, Record } from 'pocketbase';
import type pocketbaseEs from 'pocketbase';

declare global {
	namespace App {
		interface Locals {
			// user: User;
			user: Record | Admin | null;
			pb: pocketbaseEs
		}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
}