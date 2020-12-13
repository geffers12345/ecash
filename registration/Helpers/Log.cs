using registration.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace registration.Helpers
{
    public class Log
    {
        static DatabaseContext context = new DatabaseContext();
        
        public static string create(int accountId, string action, string date)
        {
            var items = new Audits
            {
                AccountId = accountId,
                Action = action,
                DateCreated = date
            };

            context.Audits.Add(items);

            context.SaveChanges();

            return "0";
        }
    }
}