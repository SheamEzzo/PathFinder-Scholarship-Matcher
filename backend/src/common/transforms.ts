import { Transform } from 'class-transformer';

export const Trim = () =>
  Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));

export const TrimItems = () =>
  Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((item: unknown) =>
          typeof item === 'string' ? item.trim() : item,
        )
      : value,
  );
