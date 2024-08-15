import * as fs from 'fs';

export class LogService {
  constructor(private dest: number | fs.PathLike) {}
  write(line: string) {
    console.log(line)
    fs.appendFile(this.dest, line + '\n', { encoding: 'utf8' }, () => {});
  }
}