// declare untyped modules that have been added to your project in `package.json`
// Module homepage on npmjs.com uses logos "TS" or "DT" to indicate if typed

import('@/arches/declarations.d.ts');
import('@/bcgov_arches_common/declarations.d.ts');
import('@/arches_component_lab/declarations.d.ts');

declare module 'zod';
declare module 'bcfms';

declare module '@/arches_component_lab';
declare module '@/bcgov_arches_common';
declare module '@/bcfms';

// declare filetypes used in `./src/` folder
declare module '*.ts';
declare module '*.vue';
