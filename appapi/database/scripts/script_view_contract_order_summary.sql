CREATE OR REPLACE VIEW view_contract_order_summary AS
SELECT 
    cs.project_id,
    p.project_number,
    p.project_name,
    cs.contract_id,
    c.contract_number,
    cs.id AS contractsheet_id,
    cs.sheetgroup_type,
    cs.sheetgroup_id,
    sg.sheetgroup_code,
    cs.sheet_code,
    cs.sheet_name,
    cs.sheet_netamt AS contract_amout, -- As requested (noted typo 'amout')
    SUM(IFNULL(os.sheet_netamt, 0)) AS order_amount
FROM 
    contractsheets cs
JOIN 
    projects p ON cs.project_id = p.id
JOIN 
    contracts c ON cs.contract_id = c.id
-- Outer join to sheetgroups
LEFT JOIN 
    sheetgroups sg ON cs.sheetgroup_id = sg.id
-- Outer join to ordersheets only for items (sheet_type = 1)
LEFT JOIN 
    ordersheets os ON os.contractsheets_id = cs.id AND os.sheet_type = 1
WHERE 
    cs.sheet_type = 1
GROUP BY 
    cs.project_id,
    p.project_number,
    p.project_name,
    cs.contract_id,
    c.contract_number,
    cs.id,
    cs.sheetgroup_type,
    cs.sheetgroup_id,
    sg.sheetgroup_code,
    cs.sheet_code,
    cs.sheet_name,
    cs.sheet_netamt;

