const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Department = require('../models/Department');
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');

// AI Prompt templates using ROCKS framework
const PROMPT_TEMPLATES = {
  hr: {
    manager: `Act as HR Manager.
Objective: Professional HR communication.
Context: Employee management, onboarding, leave requests.
Restrictions: Maintain confidentiality, use formal tone.
Format: Clear, actionable responses.`,
    employee: `Act as Employee.
Objective: Professional team communication.
Context: HR policies, team coordination.
Restrictions: Respect hierarchy, be collaborative.`
  },
  finance: {
    controller: `Act as Finance Controller.
Objective: Financial accuracy and clarity.
Context: Invoices, payments, budgets.
Restrictions: Use accurate numbers, highlight risks.
Format: Tables for data, bullet points for actions.`,
    accountant: `Act as Accountant.
Objective: Transactional precision.
Context: Accounts receivable/payable, reconciliations.
Restrictions: Verify amounts, reference documents.`
  },
  project: {
    manager: `Act as Project Manager.
Objective: Project coordination and updates.
Context: Timelines, resources, deliverables.
Restrictions: Stick to project scope and budget.
Format: Status updates, next steps, blockers.`
  }
}

// @route   POST /api/ai/chat-suggest
// @desc    AI smart reply suggestion
// @access  Private
router.post('/chat-suggest', protect, async (req, res) => {
  try {
    const { roomId, messageId, context } = req.body;

    // Get room context
    const room = await ChatRoom.findById(roomId).populate('context.companyId context.departmentId');
    const message = await Message.findById(messageId).populate('sender');
    const sender = message.sender;
    const department = await Department.findById(sender.departmentId);

    // Build ROCKS prompt
    const roleKey = department?.name?.toLowerCase() || 'general';
    const roleTemplate = PROMPT_TEMPLATES[roleKey]?.[sender.role] || PROMPT_TEMPLATES.hr?.employee;

    const prompt = `
${roleTemplate}

Current conversation context:
"${message.content}"

Previous messages: ${room.lastMessage.content}

Your role: ${sender.role} (${department?.name || 'General'})
Company context: ${room.context.companyId?.name || 'Multi-company'}
Suggested response (under 150 words):
`;

    // Mock AI response (replace with OpenAI/Groq/etc)
    const aiResponse = generateAIResponse(prompt, context);

    res.json({
      success: true,
      suggestion: aiResponse,
      usedTemplate: roleKey,
      contextUsed: {
        role: sender.role,
        department: department?.name,
        company: room.context.companyId?.name
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI suggestion failed' });
  }
});

function generateAIResponse(prompt, context) {
  // Mock implementation - replace with real AI API
  const responses = [
    "Thanks for the update. Let me review and get back to you shortly.",
    "Understood. I'll coordinate with the team and confirm timeline.",
    "Approved. Please proceed with the next steps.",
    "Need more details on the budget impact before approval.",
    "Good point. Let's schedule a quick call to discuss.",
    "Confirmed receipt. Processing now.",
    "Looks good. Moving to production."
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

module.exports = router;
