using FarmProfit.API.Contexts;
using FarmProfit.API.Extensions;
using FarmProfit.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

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
				.Where(u => u.UserId == employee.Id)
				.Select(s => new BusinessDto()
				{
					Id = s.Id,
					BusinessName = s.BusinessName,
					IDNO = s.IDNO,
					LegalForm = s.LegalForm,
					RegistrationDate = s.RegistrationDate,
					UserId = s.UserId,
					Contact = new ContractDto()
					{
						Id = s.Contract.Id,
						BusinessId = s.Contract.BusinessId,
						Address = s.Contract.Address,
						Email = s.Contract.Email,
						Phone = s.Contract.Phone,
						PostalCode = s.Contract.PostalCode,
						Region = s.Contract.Region
					}
				})
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

			var response = ConvertBusinessToDto(entity);
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

			var response = ConvertBusinessToDto(updatedEntity);

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
	private static BusinessDto ConvertBusinessToDto(EntityEntry<Businesses> entity)
	{
		var response = new BusinessDto()
		{
			Id = entity.Entity.Id,
			BusinessName = entity.Entity.BusinessName,
			IDNO = entity.Entity.IDNO,
			LegalForm = entity.Entity.LegalForm,
			RegistrationDate = entity.Entity.RegistrationDate,
			UserId = entity.Entity.UserId,
			Contact = new ContractDto()
			{
				Id = entity.Entity.Contract.Id,
				BusinessId = entity.Entity.Contract.BusinessId,
				Address = entity.Entity.Contract.Address,
				Email = entity.Entity.Contract.Email,
				Phone = entity.Entity.Contract.Phone,
				PostalCode = entity.Entity.Contract.PostalCode,
				Region = entity.Entity.Contract.Region
			}
		};
		return response;
	}
}
