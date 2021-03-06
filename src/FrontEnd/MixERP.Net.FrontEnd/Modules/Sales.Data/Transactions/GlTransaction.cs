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
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using MixERP.Net.Common;
using MixERP.Net.Core.Modules.Sales.Data.Data;
using MixERP.Net.DbFactory;
using MixERP.Net.Entities.Core;
using MixERP.Net.Entities.Models.Transactions;
using Npgsql;

namespace MixERP.Net.Core.Modules.Sales.Data.Transactions
{
    internal static class GlTransaction
    {
        public static long Add(string bookName, DateTime valueDate, int officeId, int userId, long loginId, int costCenterId, string referenceNumber, string statementReference, StockMaster stockMaster, Collection<StockDetail> details, Collection<Attachment> attachments, bool nonTaxable)
        {
            if (stockMaster == null)
            {
                return 0;
            }

            if (details == null)
            {
                return 0;
            }

            if (details.Count.Equals(0))
            {
                return 0;
            }

            string detail = StockMasterDetailHelper.CreateStockMasterDetailParameter(details);
            string attachment = AttachmentHelper.CreateAttachmentModelParameter(attachments);

            string sql = string.Format(CultureInfo.InvariantCulture, "SELECT * FROM transactions.post_sales(@BookName, @OfficeId, @UserId, @LoginId, @ValueDate, @CostCenterId, @ReferenceNumber, @StatementReference, @IsCredit, @PaymentTermId, @PartyCode, @PriceTypeId, @SalespersonId, @ShipperId, @ShippingAddressCode, @StoreId, @NonTaxable, ARRAY[{0}], ARRAY[{1}])", detail, attachment);
            using (NpgsqlCommand command = new NpgsqlCommand(sql))
            {
                command.Parameters.AddWithValue("@BookName", bookName);
                command.Parameters.AddWithValue("@OfficeId", officeId);
                command.Parameters.AddWithValue("@UserId", userId);
                command.Parameters.AddWithValue("@LoginId", loginId);
                command.Parameters.AddWithValue("@ValueDate", valueDate);
                command.Parameters.AddWithValue("@CostCenterId", costCenterId);
                command.Parameters.AddWithValue("@ReferenceNumber", referenceNumber);
                command.Parameters.AddWithValue("@StatementReference", statementReference);

                command.Parameters.AddWithValue("@IsCredit", stockMaster.IsCredit);

                if (stockMaster.PaymentTermId.Equals(0))
                {
                    command.Parameters.AddWithValue("@PaymentTermId", DBNull.Value);
                }
                else
                {
                    command.Parameters.AddWithValue("@PaymentTermId", stockMaster.PaymentTermId);
                }

                command.Parameters.AddWithValue("@PartyCode", stockMaster.PartyCode);
                command.Parameters.AddWithValue("@PriceTypeId", stockMaster.PriceTypeId);
                command.Parameters.AddWithValue("@SalespersonId", stockMaster.SalespersonId);
                command.Parameters.AddWithValue("@ShipperId", stockMaster.ShipperId);
                command.Parameters.AddWithValue("@ShippingAddressCode", stockMaster.ShippingAddressCode);
                command.Parameters.AddWithValue("@StoreId", stockMaster.StoreId);
                command.Parameters.AddWithValue("@NonTaxable", nonTaxable);

                command.Parameters.AddRange(StockMasterDetailHelper.AddStockMasterDetailParameter(details).ToArray());
                command.Parameters.AddRange(AttachmentHelper.AddAttachmentParameter(attachments).ToArray());

                long tranId = Conversion.TryCastLong(DbOperation.GetScalarValue(command));
                return tranId;
            }
        }
    }
}