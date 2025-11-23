from langchain.memory import ConversationBufferMemory
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain

def create_interview_agent(llm, role):
    memory = ConversationBufferMemory(
        memory_key="history",
        input_key="answer",
        return_messages=False
    )

    prompt = PromptTemplate(
        input_variables=["history", "answer", "role"],
        template="""You are a professional interviewer for the role: {role}.

Rules:
- NEVER repeat a question from history.
- Ask only ONE question.
- Follow up based on the candidate's last answer.
- Be professional and concise.
- Output ONLY the next question, nothing else.
- At the end you should ask a question.

Conversation history:
{history}

Candidate answer:
{answer}

Generate the next interview question:"""
    )

    chain = LLMChain(
        llm=llm,
        prompt=prompt,
        memory=memory,
        verbose=True
    )

    return chain