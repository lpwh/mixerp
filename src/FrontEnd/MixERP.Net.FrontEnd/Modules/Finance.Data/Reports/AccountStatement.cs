﻿/********************************************************************************
Copyright (C) Binod Nepal, Mix Open Foundation (http://mixof.org).

This file is part of MixERP.

MixERP is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

MixERP is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with MixERP.  If not, see <http://www.gnu.org/licenses/>.
***********************************************************************************/

using System;
using System.Collections.Generic;
using System.Linq;
using MixERP.Net.Entities;
using MixERP.Net.Entities.Core;
using MixERP.Net.Entities.Transactions;

namespace MixERP.Net.Core.Modules.Finance.Data.Reports
{
    public static class AccountStatement
    {
        public static AccountView GetAccountOverview(string accountNumber)
        {
            return Factory.Get<AccountView>("SELECT * FROM core.account_view WHERE account_number=@0;", accountNumber).FirstOrDefault();
        }

        public static IEnumerable<DbGetAccountStatementResult> GetAccountStatement(DateTime from, DateTime to, int userId, string accountNumber, int officeId)
        {
            if (to < from)
            {
                return null;
            }

            const string sql = "SELECT * FROM transactions.get_account_statement(@0::date, @1::date, @2, core.get_account_id_by_account_number(@3), @4) ORDER BY id;";
            return Factory.Get<DbGetAccountStatementResult>(sql, from, to, userId, accountNumber, officeId);
        }
    }
}