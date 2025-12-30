'use client'
// TODO: probably delete this file

import { localstored as _localstored } from '@hookstate/localstored';

export const localstored = typeof window !== 'undefined' ? _localstored : undefined;