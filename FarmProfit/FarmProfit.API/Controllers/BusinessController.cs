using FarmProfit.API.Contexts;
using FarmProfit.API.Extensions;
using FarmProfit.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FarmProfit.API.Controllers;

[ApiController]
[Route("api/business")]
public class BusinessController(AppDbContext db, ILogger<BusinessController> logger) : ControllerBase
{
	[HttpGet]
	[Authorize]
	public async Task<IActionResult> GetBusinessListForUser()
	{
		try
		{
			var employee = HttpContext.GetEmployee();
			if (employee is null) return BadRequest();

			var businessList = await db.Businesses
				.Include(b => b.Contract)
				.Where(u => u.UserId == employee.Id || u.Employees.Select(x=>x.Id).Contains(employee.Id))
				.Select(s => ConvertBusinessToDto(s))
				.ToListAsync();

			return await Task.FromResult<IActionResult>(Ok(businessList));
		}
		catch (Exception ex)
		{
			logger.LogError($"Error during business retrieval: {ex.Message}");
			return BadRequest(ex.Message);
		}
	}

	[HttpPost]
	[Authorize]
	public async Task<IActionResult> CreateBusiness(BusinessDto dto)
	{
		try
		{
			var employee = HttpContext.GetEmployee();
			if (employee is null) return BadRequest();

			var business = ConvertDtoToBusiness(dto);

			var entity = await db.Businesses.AddAsync(business);
			await db.SaveChangesAsync();

			var response = ConvertBusinessToDto(entity.Entity);
			return Ok(response);
		}
		catch (Exception ex)
		{
			logger.LogError($"Error during business save: {ex.Message}");
			return BadRequest(ex.Message);
		}
	}
	
	[HttpPut]
	[Authorize]
	public async Task<IActionResult> UpdateBusiness(BusinessDto business)
	{
		try
		{
			var employee = HttpContext.GetEmployee();
			if (employee is null) return BadRequest();

			var entity= db.Businesses.Include(b => b.Contract).FirstOrDefault(u => u.Id == business.Id);
			if (entity is null) return BadRequest("Unknown business");

			entity.BusinessName = business.BusinessName;
			entity.IDNO = business.IDNO;
			entity.LegalForm = business.LegalForm;
			entity.RegistrationDate = business.RegistrationDate;
			entity.BusinessName = business.BusinessName;
			entity.Contract.Address = business.Contact.Address;
			entity.Contract.Email = business.Contact.Email;
			entity.Contract.Phone = business.Contact.Phone;
			entity.Contract.PostalCode = business.Contact.PostalCode;
			entity.Contract.Region = business.Contact.Region;

			var updatedEntity = db.Businesses.Update(entity);

			await db.SaveChangesAsync();

			var response = ConvertBusinessToDto(updatedEntity.Entity);

			return Ok(response);
		}
		catch (Exception ex)
		{
			logger.LogError($"Error during business update: {ex.Message}");
			return BadRequest(ex.Message);
		}
	}

	private static Businesses ConvertDtoToBusiness(BusinessDto dto)
	{
		var business = new Businesses()
		{
			BusinessName = dto.BusinessName,
			IDNO = dto.IDNO,
			LegalForm = dto.LegalForm,
			RegistrationDate = dto.RegistrationDate,
			UserId = dto.UserId,
			Contract = new Contacts()
			{
				Address = dto.Contact.Address,
				Email = dto.Contact.Email,
				Phone = dto.Contact.Phone,
				PostalCode = dto.Contact.PostalCode,
				Region = dto.Contact.Region
			}
		};
		return business;
	}
	private static BusinessDto ConvertBusinessToDto(Businesses entity)
	{
		var response = new BusinessDto()
		{
			Id = entity.Id,
			BusinessName = entity.BusinessName,
			IDNO = entity.IDNO,
			LegalForm = entity.LegalForm,
			RegistrationDate = entity.RegistrationDate,
			UserId = entity.UserId,
			Contact = new ContractDto()
			{
				Id = entity.Contract.Id,
				BusinessId = entity.Contract.BusinessId,
				Address = entity.Contract.Address,
				Email = entity.Contract.Email,
				Phone = entity.Contract.Phone,
				PostalCode = entity.Contract.PostalCode,
				Region = entity.Contract.Region
			}
		};
		return response;
	}
}
