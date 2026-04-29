const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const Payroll = require('../models/Payroll');

const postPayrollToGL = async (payrollId, companyId) => {
  const Payroll = require('../models/Payroll');
  const Transaction = require('../models/Transaction');
  const Account = require('../models/Account');
  
  const payroll = await Payroll.findById(payrollId).populate('employeeId');
  
  if (payroll.glPosted || payroll.status !== 'approved') {
    throw new Error('Payroll not ready for posting or already posted');
  }

  const session = await Transaction.startSession();
  session.startTransaction();
  try {
    // Find or assume salary accounts
    const expenseAccount = await Account.findOne({ companyId, code: 'SAL-EXP' });
    const payableAccount = await Account.findOne({ companyId, code: 'SAL-PAY' });
    
    if (!expenseAccount || !payableAccount) {
      throw new Error('Create GL accounts SAL-EXP (expense) and SAL-PAY (liability)');
    }

    // Create debit salary expense
    await Transaction.create([{
      companyId,
      accountId: expenseAccount._id,
      type: 'debit',
      amount: payroll.netSalary,
      description: `Payroll ${payroll.employeeId.firstName} ${payroll.employeeId.lastName} ${payroll.month}/${payroll.year}`,
      category: 'payroll',
      relatedPayroll: payroll._id,
      createdBy: payroll.employeeId._id
    }, {
      companyId,
      accountId: payableAccount._id,
      type: 'credit',
      amount: payroll.netSalary,
      description: `Payroll payable ${payroll.employeeId.firstName} ${payroll.employeeId.lastName} ${payroll.month}/${payroll.year}`,
      category: 'payroll',
      relatedPayroll: payroll._id,
      createdBy: payroll.employeeId._id
    }], { session });

    // Update payroll
    payroll.glPosted = true;
    await payroll.save({ session });

    await session.commitTransaction();
    session.endSession();
    return payroll;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = { postPayrollToGL };
