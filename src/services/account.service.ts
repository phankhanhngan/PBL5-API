import { Document } from 'mongoose';
import Account, { IAccount, IAccountMethods } from '../models/account.model';

class accountService {
  constructor() {}

  create = (account: Document) => {
    return account.save();
  };

  get = (id: string) => {
    return Account.findById(id);
  };

  getByUsername = (username: string) => {
    return Account.findOne({ username: username }).select('+password');
  };

  getAll = () => {
    return Account.find();
  };

  update = (id: string, account: Document) => {
    return Account.findByIdAndUpdate(id, account, { new: true });
  };

  delete = (id: string) => {
    return Account.findByIdAndDelete(id);
  };

  search = (reqQuery) => {
    const searchQuery = {};

    if (reqQuery.keyword) {
      searchQuery['$or'] = [
        { $text: { $search: reqQuery.keyword } },
        {
          username: new RegExp(reqQuery.keyword, 'i')
        },
        {
          phone: new RegExp(reqQuery.keyword, 'i')
        }
      ];
    }

    if (reqQuery.type) {
      searchQuery['type'] = new RegExp(reqQuery.type, 'i');
    }

    return Account.find(searchQuery);
  };
}

export default accountService;
