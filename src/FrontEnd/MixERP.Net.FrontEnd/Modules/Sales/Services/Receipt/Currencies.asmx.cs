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

using System.Web.Script.Services;
using System.Web.Services;
using MixERP.Net.Common.Extensions;
using MixERP.Net.Entities.Core;
using MixERP.Net.FrontEnd.Cache;

namespace MixERP.Net.Core.Modules.Sales.Services.Receipt
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [ScriptService]
    public class Currencies : WebService
    {
        [WebMethod]
        public System.Collections.ObjectModel.Collection<System.Web.UI.WebControls.ListItem> GetCurrencies()
        {
            System.Collections.ObjectModel.Collection<System.Web.UI.WebControls.ListItem> values = new System.Collections.ObjectModel.Collection<System.Web.UI.WebControls.ListItem>();

            foreach (Currency currency in Data.Helpers.Currencies.GetCurrencies())
            {
                values.Add(new System.Web.UI.WebControls.ListItem(currency.CurrencyCode, currency.CurrencyCode));
            }

            return values;
        }

        [WebMethod(EnableSession = true)]
        public decimal GetExchangeRate(string sourceCurrencyCode, string destinationCurrencyCode)
        {
            if (string.IsNullOrWhiteSpace(sourceCurrencyCode))
            {
                return 0;
            }

            if (string.IsNullOrWhiteSpace(destinationCurrencyCode))
            {
                return 0;
            }

            if (sourceCurrencyCode.Equals(destinationCurrencyCode))
            {
                return 1;
            }

            int officeId = CurrentUser.GetSignInView().OfficeId.ToInt();

            decimal exchangeRate = Data.Helpers.Transaction.GetExchangeRate(officeId, sourceCurrencyCode, destinationCurrencyCode);

            return exchangeRate;
        }

        [WebMethod(EnableSession = true)]
        public string GetHomeCurrency()
        {
            int officeId = CurrentUser.GetSignInView().OfficeId.ToInt();
            return Data.Helpers.Currencies.GetHomeCurrency(officeId);
        }
    }
}