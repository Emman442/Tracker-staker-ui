import { config } from 'dotenv';
config();

import '@/ai/flows/validate-reward-vault-funding.ts';
import '@/ai/flows/ensure-unstaking-validity.ts';