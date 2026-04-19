using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Specification
{
    public class ProductParamSpecification
    {
		private const int Max_Page_Size = 50;
		private int _pageSize=6;

		public int PageSize
		{
			get => _pageSize;
			set => _pageSize = value > Max_Page_Size ? Max_Page_Size : value ;
		}
		public int PageIndex { get; set; } = 1;
		private List<string> _brands = [];

		public List<string> Brands
		{
			get { return _brands; }
			set { _brands =  value.SelectMany(x=>x.Split(',',StringSplitOptions.RemoveEmptyEntries)).ToList(); }
		}
		private List<string> _types = [];

		public List<string> Types
		{
			get { return _types; }
			set { _types =  value.SelectMany(x=>x.Split(',',StringSplitOptions.RemoveEmptyEntries)).ToList(); }
		}
		public string? Sort {  get; set; }
		private string? _search;

		public string Search
		{
			get { return _search?? ""; }
			set { _search = value.ToLower(); }
		}

	}
}
