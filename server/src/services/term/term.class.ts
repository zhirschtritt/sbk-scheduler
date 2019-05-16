import {TermsRepository} from './TermsRepository';

export class TermsService {
  constructor(private readonly repository: TermsRepository) {}

  async find() {
    const allTerms = await this.repository.findAll();

    return allTerms.map(term => {
      return {
        id: Number(term.id),
        start: term.start,
        end: term.end,
      };
    });
  }

  async get(id: string) {
    const term = await this.repository.findOneById(id);

    return {
      id: Number(term.id),
      start: term.start,
      end: term.end,
    };
  }
}

export default function(repository: TermsRepository) {
  return new TermsService(repository);
}
