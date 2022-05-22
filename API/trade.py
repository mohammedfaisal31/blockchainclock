from InvestopediaApi import ita
client = ita.Account("fxisxl_5c", "65109105@stock")

status = client.get_portfolio_status()
print(status.account_val)
print(status.buying_power)
print(status.cash)
print(status.annual_return)