import * as yup from 'yup';

export const getReposSchema = yup.object().shape({
  pastDays: yup.number().default(7).max(7).min(1),
});

export type GetRepos = yup.InferType<typeof getReposSchema>;

