from nextcord import Interaction
from nextcord.ext import commands

class TestDiscord(commands.Cog):
    def __init__(self, client):
        self.client = client

    @commands.command(name='ping')
    async def ping(self, ctx: Interaction):
        await ctx.send('Pong!')

def setup(client):
    client.add_cog(TestDiscord(client))