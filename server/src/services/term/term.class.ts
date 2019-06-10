import {TermsRepository} from './TermsRepository';
import moment = require('moment');

export class TermsService {
  constructor(private readonly repository: TermsRepository) {}

  async find() {
    const allTerms = await this.repository.findAll();

    return allTerms.map(term => {
      return {
        id: term.id,
        start: new Date(term.start),
        end: new Date(term.end),
      };
    });
  }

  async get(id: string) {
    const term = await this.repository.findOneById(id);

    return {
      id: term.id,
      start: new Date(term.start),
      end: new Date(term.end),
    };
  }
}

export default function(repository: TermsRepository) {
  return new TermsService(repository);
}
