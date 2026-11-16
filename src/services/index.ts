import { env } from '@/config/env';
import { apiSource } from './apiSource';
import type { DataSource } from './dataSource';
import { mockSource } from './mockSource';

export const dataSource: DataSource = env.dataSource === 'api' ? apiSource : mockSource;
export type { DataSource } from './dataSource';
