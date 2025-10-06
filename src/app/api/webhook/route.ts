import { NextResponse } from "next/server"

// Mock AI responses for testing markdown styling
const mockResponses = [
  {
    type: "contract_analysis",
    content: `The Indian Penal Code (IPC) of 1860 is the principal criminal code of India. It covers a wide range of substantive criminal law, defining offenses and prescribing punishments. It's important to note that the Indian Parliament has recently passed the **Bharatiya Nyaya Sanhita, 2023 (BNS)**, which is intended to replace the IPC. However, as of now, the **IPC 1860 remains in force** until the BNS is officially notified and implemented.\n\nBelow is a table of some of the most important and frequently referenced sections of the IPC. This list is not exhaustive but covers major categories of offenses.\n\n**Key to Nature of Offence:**\n* **C:** Cognizable (Police can arrest without a warrant)\n* **NC:** Non-Cognizable (Police require a magistrate's order to investigate/arrest)\n* **B:** Bailable (Bail is a matter of right)\n* **NB:** Non-Bailable (Bail is at the discretion of the court)\n* **Comp:** Compoundable (Can be settled/withdrawn by the victim, sometimes with court permission)\n* **NComp:** Non-Compoundable (Cannot be settled out of court)\n\n---\n\n**Table of Important Sections of the Indian Penal Code, 1860**\n\n| Section(s) | Offence Description | Key Punishment | Nature (General) | Notes/Context |\n| :--------- | :------------------ | :------------- | :--------------- | :------------ |\n| **I. General Explanations & Principles** | | | | |\n| 34 | Acts done by several persons in furtherance of common intention | Same as if done by one person | Depends on the main offence | Principle of joint liability. |\n| 107 | Abetment of a thing | Varies | Depends on the main offence | Instigating, engaging in conspiracy, or intentionally aiding. |\n| 109 | Punishment of abetment if the act abetted is committed in consequence | Varies, same as principal offence | Depends on the main offence | If the abetted act is committed. |\n| 120A | Definition of Criminal Conspiracy | Imprisonment, Fine | C/NB/NComp | Agreement to commit an illegal act or a legal act by illegal means. |\n| 120B | Punishment of Criminal Conspiracy | Up to Life Imprisonment/Death or 6 months + Fine | C/NB/NComp | Varies based on the conspired offence. |\n| **II. Offences Against the State & Public Tranquility** | | | | |\n| 124A | Sedition | Life Imprisonment + Fine, or up to 3 years + Fine | C/NB/NComp | **Currently stayed by the Supreme Court of India vide order dated 11.05.2022.** |\n| 141 | Unlawful Assembly | Up to 6 months + Fine | C/B/Comp | Five or more persons with a common object to commit an offence. |\n| 147 | Punishment for Rioting | Up to 2 years + Fine | C/B/NComp | Force or violence used by an unlawful assembly. |\n| 153A | Promoting enmity between different groups | Up to 3 years + Fine | C/NB/NComp | On grounds of religion, race, place of birth, residence, language, etc. |\n| **III. Offences Against the Human Body** | | | | |\n| 299 | Culpable Homicide | Varies (see 304) | C/NB/NComp | Causing death with intention or knowledge of likelihood of death. |\n| 300 | Murder | Death or Life Imprisonment + Fine | C/NB/NComp | Specific conditions distinguishing it from culpable homicide. |\n| 302 | Punishment for Murder | Death or Life Imprisonment + Fine | C/NB/NComp | Mandatory punishment for murder. |\n| 304 | Punishment for Culpable Homicide not amounting to murder | Life Imprisonment or up to 10 years + Fine (Part I), or up to 10 years + Fine (Part II) | C/NB/NComp | Based on intention/knowledge. |\n| 304A | Causing death by negligence | Up to 2 years + Fine | C/B/NComp | Rash or negligent act not amounting to culpable homicide. |\n| 304B | Dowry Death | Imprisonment for not less than 7 years, extendable to Life Imprisonment | C/NB/NComp | Death of a woman within 7 years of marriage due to cruelty for dowry. |\n| 307 | Attempt to Murder | Up to 10 years + Fine; Life Imprisonment (if hurt caused) | C/NB/NComp | Doing an act with intent to cause death. |\n| 309 | Attempt to Commit Suicide | Up to 1 year + Fine | NC/B/NComp | **Under Section 115 of the Mental Healthcare Act, 2017, a person attempting suicide is presumed to have severe stress and shall not be punished.** |\n| 319 | Hurt | Varies (see 323) | C/B/Comp (minor) | Bodily pain, disease or infirmity. |\n| 320 | Grievous Hurt | Varies (see 325, 326) | C/NB/NComp | Specific severe types of hurt (e.g., emasculation, permanent privation of sight/hearing, fracture). |\n| 323 | Punishment for Voluntarily Causing Hurt | Up to 1 year + Fine | C/B/Comp | Simple hurt. |\n| 325 | Punishment for Voluntarily Causing Grievous Hurt | Up to 7 years + Fine | C/NB/NComp | |\n| 326 | Voluntarily causing grievous hurt by dangerous weapons or means | Life Imprisonment or up to 10 years + Fine | C/NB/NComp | Use of dangerous weapons, fire, poison, etc. |\n| 326A | Voluntarily causing grievous hurt by use of acid, etc. | Not less than 10 years, extendable to Life Imprisonment + Fine | C/NB/NComp | Acid attack. |\n| 326B | Voluntarily throwing or attempting to throw acid | Not less than 5 years, extendable to 7 years + Fine | C/NB/NComp | Attempted acid attack. |\n| 339 | Wrongful Restraint | Up to 1 month + Fine | NC/B/Comp | Preventing a person from proceeding in any direction they have a right to. |\n| 340 | Wrongful Confinement | Up to 1 year + Fine | C/B/Comp | Wrongfully restraining a person so as to prevent them from moving beyond certain circumscribing limits. |\n| 350 | Criminal Force | Varies (see 352) | C/B/Comp | Intentional use of force without consent to cause injury, fear, or annoyance. |\n| 351 | Assault | Varies (see 352) | C/B/Comp | Making any gesture or preparation intending or knowing it to be likely to cause apprehension of criminal force. |\n| 354 | Assault or criminal force to woman with intent to outrage her modesty | Up to 5 years + Fine | C/NB/NComp | |\n| 354A | Sexual Harassment and punishment for sexual harassment | Up to 3 years + Fine | C/B/NComp | Physical contact, unwelcome sexual advances, demand for sexual favours, showing pornography, etc. |\n| 354D | Stalking | Up to 3 years (1st conviction), up to 5 years (2nd/subsequent) + Fine | C/B/NComp | Following, contacting, monitoring a person against their will. |\n| 359 | Kidnapping | Varies (see 363) | C/NB/NComp | From India or from lawful guardianship. |\n| 362 | Abduction | Varies (see 363) | C/NB/NComp | Forcibly compelling a person to go from one place to another. |\n| 363 | Punishment for Kidnapping | Up to 7 years + Fine | C/NB/NComp | General punishment for kidnapping. |\n| 375 | Rape (Definition) | Varies (see 376) | C/NB/NComp | Defines what constitutes rape. |\n| 376 | Punishment for Rape (and various sub-sections 376A, 376AB, 376B, 376C, 376D, 376DA, 376DB, 376E) | Not less than 7 years, extendable to Life Imprisonment or Death | C/NB/NComp | Specific punishments for various forms of rape, including gang rape, repeat offenders, etc. |\n| 377 | Unnatural Offences | Life Imprisonment or up to 10 years + Fine | C/NB/NComp | **Decriminalized for consensual sexual acts between adults by *Navtej Singh Johar v. Union of India (2018)*. Still applies to non-consensual acts and bestiality.** |\n| **IV. Offences Against Property** | | | | |\n| 378 | Theft | Varies (see 379) | C/B/Comp (minor) | Dishonestly taking movable property out of possession without consent. |\n| 379 | Punishment for Theft | Up to 3 years + Fine | C/B/Comp (minor) | |\n| 383 | Extortion | Up to 3 years + Fine | C/B/Comp (minor) | Intentionally putting a person in fear of injury to dishonestly induce delivery of property. |\n| 390 | Robbery | Varies (see 392, 394) | C/NB/NComp | Theft or extortion accompanied by force or fear of instant death, hurt, or wrongful restraint. |\n| 391 | Dacoity | Life Imprisonment or up to 10 years + Fine | C/NB/NComp | Robbery committed by five or more persons. |\n| 403 | Dishonest Misappropriation of Property | Up to 2 years + Fine | C/B/Comp | Dishonestly converting movable property for one's own use. |\n| 405 | Criminal Breach of Trust | Up to 3 years + Fine | C/NB/NComp | Dishonest misappropriation of property entrusted to a person. |\n| 411 | Dishonestly receiving stolen property | Up to 3 years + Fine | C/B/Comp | |\n| 415 | Cheating | Varies (see 417, 420) | C/B/Comp | Dishonestly inducing a person to deliver property or alter property. |\n| 420 | Cheating and dishonestly inducing delivery of property | Up to 7 years + Fine | C/NB/Comp | More severe form of cheating involving property. |\n| 425 | Mischief | Varies (see 426) | C/B/Comp | Causing wrongful loss or damage to property. |\n| 441 | Criminal Trespass | Up to 3 months + Fine | C/B/Comp | Entry into property in possession of another with intent to commit an offence or intimidate, insult or annoy. |\n| 447 | Punishment for Criminal Trespass | Up to 3 months + Fine | C/B/Comp | |\n| 448 | House-trespass | Up to 1 year + Fine | C/B/Comp | Criminal trespass by entering into or remaining in any building, tent or vessel. |\n| **V. Offences Relating to Documents and Property Marks** | | | | |\n| 463 | Forgery | Up to 2 years + Fine | C/B/NComp | Making a false document or electronic record with intent to cause damage or fraud. |\n| 464 | Making a false document or false electronic record | Varies (see 465) | C/B/NComp | How a false document is made. |\n| 465 | Punishment for Forgery | Up to 2 years + Fine | C/B/NComp | General punishment for forgery. |\n| **VI. Offences Relating to Marriage** | | | | |\n| 494 | Marrying again during lifetime of husband or wife | Up to 7 years + Fine | NC/B/Comp | Bigamy. |\n| 498A | Husband or relative of husband of a woman subjecting her to cruelty | Up to 3 years + Fine | C/NB/NComp | Cruelty (mental or physical) by husband or his relatives. |\n| **VII. Defamation** | | | | |\n| 499 | Defamation (Definition) | Varies (see 500) | NC/B/Comp | Making or publishing any imputation concerning any person intending to harm their reputation. |\n| 500 | Punishment for Defamation | Up to 2 years + Fine | NC/B/Comp | |\n| **VIII. Criminal Intimidation, Insult and Annoyance** | | | | |\n| 503 | Criminal Intimidation | Varies (see 506) | NC/B/Comp | Threatening injury to person, reputation or property with intent to cause alarm or induce action. |\n| 506 | Punishment for Criminal Intimidation | Up to 2 years + Fine (simple); Up to 7 years + Fine (if threat to cause death/grievous hurt, etc.) | C/B/Comp (simple), C/NB/NComp (aggravated) | |\n| 509 | Word, gesture or act intended to insult the modesty of a woman | Up to 3 years + Fine | C/B/Comp | Uttering words, making sounds or gestures, or exhibiting any object intending to insult modesty. |\n\n---\n\n**Important Disclaimer:**\nThis table provides a simplified overview of important sections of the IPC for general informational purposes.\n* **It is not exhaustive:** The IPC contains many more sections.\n* **Punishments and classifications (Cognizable/Non-Cognizable, Bailable/Non-Bailable, Compoundable/Non-Compoundable) can vary** based on specific sub-sections, the severity of the act, the age of the victim, or other aggravating circumstances.\n* **Legal interpretations can be complex.**\n* **This information should not be considered legal advice.** For any specific legal query or situation, it is crucial to consult with a qualified legal professional.\n* Remember the ongoing legislative changes with the **Bharatiya Nyaya Sanhita (BNS)`
  },
  {
    type: "legal_research",
    content: `# Legal Research: Data Privacy Laws

## Overview

Data privacy regulations have evolved significantly in recent years. Here's what you need to know:

### Key Regulations

- **GDPR** (General Data Protection Regulation) - EU
- **CCPA** (California Consumer Privacy Act) - California, USA
- **PIPEDA** (Personal Information Protection and Electronic Documents Act) - Canada

## Compliance Requirements

1. **Data Collection**
   - Obtain explicit consent
   - Provide clear privacy notices
   - Implement purpose limitation

2. **Data Processing**
   - Ensure lawful basis exists
   - Maintain data accuracy
   - Implement security measures

3. **Individual Rights**
   - Right to access personal data
   - Right to rectification
   - Right to erasure ("right to be forgotten")

### Penalty Structure

| Violation Type | GDPR Fine | CCPA Fine |
|---------------|-----------|-----------|
| Minor | Up to €10M or 2% revenue | Up to $2,500 per violation |
| Major | Up to €20M or 4% revenue | Up to $7,500 per violation |

> **Pro Tip**: Start with a privacy-by-design approach to avoid costly compliance issues later.

## Implementation Checklist

- [ ] Conduct privacy impact assessment
- [ ] Update privacy policy
- [ ] Implement consent management
- [ ] Train staff on data handling
- [ ] Establish breach notification procedures

*Need help with compliance? Contact a privacy law specialist.*`
  },
  {
    type: "litigation_advice",
    content: `# Litigation Strategy Assessment

## Case Summary

Your breach of contract dispute involves the following elements:

### Strengths of Your Position

1. **Clear contractual terms** - The agreement explicitly states delivery timelines
2. **Documentation** - Email trail shows repeated delays and excuses
3. **Damages** - Quantifiable losses due to delayed performance

### Potential Challenges

- **Force Majeure Claims**: Defendant may argue COVID-19 impacts
- **Mitigation of Damages**: Court may question if you minimized losses
- **Statute of Limitations**: Ensure all claims are filed timely

## Recommended Strategy

### Phase 1: Pre-Litigation
- Send formal demand letter
- Attempt mediation
- Gather additional evidence

### Phase 2: Filing
\`\`\`markdown
**Key Documents Needed:**
- Original contract
- All correspondence
- Proof of damages
- Expert witness statements
\`\`\`

### Phase 3: Discovery
Expect the following timeline:
- **Months 1-3**: Initial discovery requests
- **Months 4-6**: Depositions and expert reports  
- **Months 7-9**: Trial preparation

## Cost-Benefit Analysis

| Scenario | Probability | Potential Recovery | Legal Costs |
|----------|-------------|-------------------|-------------|
| Settlement | 60% | $75,000 - $100,000 | $15,000 |
| Trial Win | 25% | $150,000 - $200,000 | $50,000 |
| Trial Loss | 15% | $0 | $50,000 + defendant's costs |

> **Recommendation**: Pursue settlement negotiations while preparing for trial.

**Next Steps**: Schedule a strategy session to discuss settlement parameters and trial timeline.`
  },
  {
    type: "simple_advice",
    content: `Thank you for your question about **tenant rights** in lease disputes.

Based on the information provided, here are the key points:

- Your landlord **cannot** enter without 24-hour notice except in emergencies
- The \`security deposit\` must be returned within 30 days of lease termination
- You have the right to request repairs in writing

## Quick Action Items:
1. Document all communications with your landlord
2. Take photos of any property damage
3. Review your local tenant protection laws

*Would you like me to explain any specific tenant rights in more detail?*`
  }
]

function getRandomResponse() {
  const randomIndex = Math.floor(Math.random() * mockResponses.length)
  return mockResponses[randomIndex].content
}

function simulateTypingDelay() {
  // Simulate realistic API response time (500ms to 2s)
  return new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 500))
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Simulate API processing time
    await simulateTypingDelay()
    
    // For testing purposes, you can also create responses based on the input
    let response = getRandomResponse()
    
    // Optional: Generate contextual responses based on input keywords
    if (body.message) {
      const message = body.message.toLowerCase()
      if (message.includes('contract') || message.includes('agreement')) {
        response = mockResponses[0].content
      } else if (message.includes('privacy') || message.includes('data') || message.includes('gdpr')) {
        response = mockResponses[1].content
      } else if (message.includes('lawsuit') || message.includes('litigation') || message.includes('court')) {
        response = mockResponses[2].content
      } else if (message.includes('tenant') || message.includes('landlord') || message.includes('rent')) {
        response = mockResponses[3].content
      }
    }

    return NextResponse.json({ text: response })
  } catch (err) {
    console.error("Error generating mock response:", err)
    
    // Fallback response
    const fallbackResponse = `I apologize, but I'm experiencing some technical difficulties. 

However, I'm here to help with your legal questions. Please try asking again, and I'll do my best to provide you with accurate legal information and guidance.

**Common areas I can assist with:**
- Contract review and analysis  
- Employment law questions
- Tenant and landlord disputes
- Business formation guidance
- Intellectual property basics

*Please note: This is for informational purposes only and does not constitute legal advice.*`
    
    return NextResponse.json({ text: fallbackResponse })
  }
}
