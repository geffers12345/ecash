using registration.Enumerations;
using registration.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace registration.Models
{
    public class StudentTransactions
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int AccountId { get; set; }
        public virtual Accounts Accounts { get; set; }
        [Required]
        public TransactionTypes TransactionType { get; set; }
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public string Code { get; set; }
        [Required]
        public string QrPath { get; set; }
        [Required]
        public bool IsActive { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public DateTime DateDeleted { get; set; }
    }
}