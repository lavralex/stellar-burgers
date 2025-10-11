import '@testing-library/jest-dom';

jest.mock('react-intersection-observer', () => ({
  useInView: () => [{ ref: jest.fn() }, true]
}));
