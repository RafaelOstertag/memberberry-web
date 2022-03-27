import {AlphanumPipe} from './alphanum.pipe';

describe('AlphanumPipe', () => {
  it('create an instance', () => {
    const pipe = new AlphanumPipe();
    expect(pipe).toBeTruthy();
  });

  it('translate non alphanumeric characters', () => {
    const pipe = new AlphanumPipe();
    expect(pipe.transform('a#$%^& b~`*()c')).toBe('a______b_____c')
  });
});
